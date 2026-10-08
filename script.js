// 상식 퀴즈. 앞부분은 DOM을 쓰지 않는 순수 함수, 뒷부분은 화면 함수다. 요구 사항은 PRD.md 참고.

const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const QUESTIONS_PER_ROUND = 10;

// Fisher–Yates. 원본은 건드리지 않고 섞인 새 배열을 돌려준다.
// random을 바꿔 넣을 수 있게 해서 테스트에서 결과를 고정한다.
function shuffle(array, random = Math.random) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 8 → "8", 7.5 → "7.5"
function formatScore(score) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function isFilledText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// 문항 하나의 형식 오류 목록. 빈 배열이면 통과다. (PRD 10.1)
function validateQuestion(q) {
  const errors = [];
  const where = isFilledText(q.id) ? q.id : "(id 없음)";

  if (!isFilledText(q.id)) errors.push(`${where}: id가 비어 있음`);
  if (!CATEGORIES.includes(q.category)) errors.push(`${where}: 알 수 없는 카테고리 "${q.category}"`);
  if (!isFilledText(q.question)) errors.push(`${where}: 문제가 비어 있음`);

  const choicesOk = Array.isArray(q.choices)
    && q.choices.length === 4
    && q.choices.every(isFilledText)
    && new Set(q.choices).size === 4;
  if (!choicesOk) errors.push(`${where}: 보기는 서로 다른 문자열 4개여야 함`);

  if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3)) {
    errors.push(`${where}: answer는 0~3의 정수여야 함`);
  }
  if (!isFilledText(q.explanation)) errors.push(`${where}: 해설이 비어 있음`);
  if (!q.source || !isFilledText(q.source.name)) errors.push(`${where}: 출처 이름이 비어 있음`);
  if (!q.source || typeof q.source.url !== "string" || !q.source.url.startsWith("https://")) {
    errors.push(`${where}: 출처 URL은 https://로 시작해야 함`);
  }
  return errors;
}

// 전체 문항 검사: 각 문항 + id 중복 + 전체 개수 + 카테고리별 개수
function validateQuestions(questions) {
  const errors = questions.flatMap(validateQuestion);

  const ids = questions.map(q => q.id);
  const duplicated = new Set(ids.filter((id, i) => ids.indexOf(id) !== i));
  duplicated.forEach(id => errors.push(`${id}: id가 중복됨`));

  const expectedTotal = CATEGORIES.length * QUESTIONS_PER_ROUND;
  if (questions.length !== expectedTotal) {
    errors.push(`전체 문항이 ${questions.length}개임 (${expectedTotal}개여야 함)`);
  }
  CATEGORIES.forEach(category => {
    const count = questions.filter(q => q.category === category).length;
    if (count !== QUESTIONS_PER_ROUND) {
      errors.push(`${category} 문항이 ${count}개임 (${QUESTIONS_PER_ROUND}개여야 함)`);
    }
  });
  return errors;
}

// 보기를 섞은 복사본을 만든다. 정답 위치는 정답 보기의 "내용"을 따라 다시 계산한다.
function prepareQuestion(q, random = Math.random) {
  const correctText = q.choices[q.answer];
  const choices = shuffle(q.choices, random);
  return Object.assign({}, q, { choices, answer: choices.indexOf(correctText) });
}

// 카테고리의 문항을 섞어서 한 판(최대 10문항)을 만든다.
function buildRound(questions, category, random = Math.random) {
  const pool = questions.filter(q => q.category === category);
  return shuffle(pool, random)
    .slice(0, QUESTIONS_PER_ROUND)
    .map(q => prepareQuestion(q, random));
}

// 한 문항의 점수. 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리거나 시간 초과면 0점. (PRD 5장)
function scoreForAnswer(isCorrect, hintUsed) {
  if (!isCorrect) return 0;
  return hintUsed ? 0.5 : 1;
}

// 힌트로 지울 오답 위치 2개. 정답 위치는 절대 고르지 않는다. (PRD 5.2)
function pickHintRemovals(q, random = Math.random) {
  const wrongIndexes = [0, 1, 2, 3].filter(i => i !== q.answer);
  return shuffle(wrongIndexes, random).slice(0, 2);
}

// 틀린 문항만 다시 섞어서 만든 판. 보기도 새로 섞는다. (PRD 6장)
function buildRetryRound(questions, wrongIds, random = Math.random) {
  const pool = questions.filter(q => wrongIds.includes(q.id));
  return shuffle(pool, random).map(q => prepareQuestion(q, random));
}

// ---- 여기부터 화면 (DOM) ----

// 모드별 차이는 이 표에 모은다. (PRD 5장)
const MODES = {
  practice: { label: "연습",   timeLimit: null, hint: false, ranked: false },
  speed:    { label: "스피드", timeLimit: 15,   hint: false, ranked: true  },
  hint:     { label: "힌트",   timeLimit: null, hint: true,  ranked: true  },
};

const state = {
  category: null,
  mode: "practice",
  questions: [],   // 이번 판 문항 (섞인 순서, 섞인 보기)
  index: 0,        // 현재 문항 위치
  score: 0,
  wrongIds: [],    // 이번 판에서 틀린 문항 id
  isRetry: false,  // 다시 풀기 판인지
  hintUsed: false, // 현재 문항에서 힌트를 썼는지
  timerId: null,
  timeLeft: 0,
};

// 예: "한국사 · 연습" / "한국사 · 연습 · 다시 풀기"
function roundLabel() {
  const base = `${state.category} · ${MODES[state.mode].label}`;
  return state.isRetry ? `${base} · 다시 풀기` : base;
}

function byId(id) {
  return document.getElementById(id);
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(section => {
    section.hidden = section.id !== `screen-${name}`;
  });
}

function selectCategory(category) {
  state.category = category;
  document.querySelectorAll("#category-list .option").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  });
  byId("start-button").disabled = false;
}

// 카테고리를 고른 뒤 [다음]을 누르면 모드 선택 화면으로 간다.
function showModeScreen() {
  byId("mode-title").textContent = `${state.category} · 퀴즈 모드를 고르세요`;
  showScreen("mode");
  document.querySelector("#mode-list .mode-card").focus();
}

function selectMode(mode) {
  state.mode = mode;
  startNewRound();
}

// 같은 카테고리와 모드로 새 판을 시작한다. ([다시 하기]도 이 함수를 쓴다)
function startNewRound() {
  startGame(buildRound(QUESTIONS, state.category), false);
}

// 방금 판에서 틀린 문항만 다시 푼다. (연습 모드)
function startRetry() {
  startGame(buildRetryRound(QUESTIONS, state.wrongIds), true);
}

function startGame(questions, isRetry) {
  stopTimer();
  state.questions = questions;
  state.isRetry = isRetry;
  state.wrongIds = [];
  state.index = 0;
  state.score = 0;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  byId("quiz-progress").textContent =
    `${roundLabel()} · ${state.index + 1}/${state.questions.length}`;
  byId("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
  byId("question-text").textContent = q.question;

  const list = byId("choice-list");
  list.replaceChildren();
  q.choices.forEach((choice, i) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => handleAnswer(i));
    list.appendChild(button);
  });
  byId("feedback").hidden = true;

  const mode = MODES[state.mode];
  state.hintUsed = false;
  const hintButton = byId("hint-button");
  hintButton.hidden = !mode.hint;
  hintButton.disabled = false;

  byId("quiz-timer").hidden = mode.timeLimit === null;
  if (mode.timeLimit !== null) startTimer(mode.timeLimit);
}

// ---- 스피드 모드 타이머 (PRD 5.1) ----

function renderTimer() {
  const timer = byId("quiz-timer");
  timer.textContent = `남은 시간 ${state.timeLeft}초`;
  timer.classList.toggle("urgent", state.timeLeft <= 5);
}

function startTimer(seconds) {
  stopTimer();
  state.timeLeft = seconds;
  renderTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    renderTimer();
    if (state.timeLeft <= 0) handleTimeout();
  }, 1000);
}

function stopTimer() {
  if (state.timerId !== null) clearInterval(state.timerId);
  state.timerId = null;
}

// 0초가 되면 오답 처리: 보기를 잠그고 정답만 초록으로 표시한다.
function handleTimeout() {
  stopTimer();
  state.wrongIds.push(state.questions[state.index].id);
  lockChoices(null);
  showFeedback("시간 초과", false);
}

// ---- 힌트 모드 (PRD 5.2) ----

function useHint() {
  const q = state.questions[state.index];
  const buttons = byId("choice-list").querySelectorAll(".choice");
  pickHintRemovals(q).forEach(i => {
    buttons[i].disabled = true;
    buttons[i].classList.add("removed");
  });
  state.hintUsed = true;
  byId("hint-button").disabled = true;
}

// 보기를 모두 잠그고 정답은 초록, 고른 오답은 빨강으로 표시한다.
function lockChoices(choiceIndex) {
  const q = state.questions[state.index];
  byId("choice-list").querySelectorAll(".choice").forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) button.classList.add("correct");
    else if (i === choiceIndex) button.classList.add("wrong");
  });
  byId("hint-button").disabled = true;
}

function handleAnswer(choiceIndex) {
  const q = state.questions[state.index];
  const isCorrect = choiceIndex === q.answer;
  stopTimer();
  state.score += scoreForAnswer(isCorrect, state.hintUsed);
  if (!isCorrect) state.wrongIds.push(q.id);
  lockChoices(choiceIndex);
  showFeedback(isCorrect ? "정답" : "오답", isCorrect);
}

// 정답 여부, 해설, 출처, [다음] 버튼을 보여 준다.
function showFeedback(verdict, isCorrect) {
  const q = state.questions[state.index];
  byId("quiz-score").textContent = `점수 ${formatScore(state.score)}`;

  const verdictText = byId("feedback-verdict");
  verdictText.textContent = verdict;
  verdictText.className = isCorrect ? "verdict correct" : "verdict wrong";
  byId("feedback-explanation").textContent = q.explanation;

  const link = byId("feedback-source");
  link.textContent = q.source.name;
  link.href = q.source.url;

  const isLast = state.index === state.questions.length - 1;
  byId("next-button").textContent = isLast ? "결과 보기" : "다음";
  byId("feedback").hidden = false;
  byId("next-button").focus();
}

function nextQuestion() {
  if (state.index === state.questions.length - 1) {
    showResult();
    return;
  }
  state.index += 1;
  renderQuestion();
}

function showResult() {
  stopTimer();
  const total = state.questions.length;
  byId("result-title").textContent = roundLabel();

  if (state.isRetry) {
    // 다시 풀기 판은 맞힌 개수만 보여 준다. 처음 판의 점수는 바뀌지 않는다.
    const correct = total - state.wrongIds.length;
    byId("result-score").textContent = `${total}문제 중 ${correct}개 맞힘`;
  } else {
    byId("result-score").textContent = `${formatScore(state.score)} / ${total}`;
  }
  byId("result-score").classList.toggle("small", state.isRetry);

  const allCorrect = state.isRetry && state.wrongIds.length === 0;
  byId("result-all-correct").hidden = !allCorrect;
  byId("result-unranked").hidden = MODES[state.mode].ranked;
  // 틀린 문제 다시 풀기는 연습 모드에만 있다.
  byId("retry-button").hidden = state.mode !== "practice" || state.wrongIds.length === 0;
  showScreen("result");
}

function quitGame() {
  if (confirm("그만두면 기록이 저장되지 않아요. 처음으로 갈까요?")) {
    stopTimer();
    showScreen("start");
  }
}

function initApp() {
  validateQuestions(QUESTIONS).forEach(error => console.error(`[문항 검사] ${error}`));

  document.querySelectorAll("#category-list .option").forEach(button => {
    button.addEventListener("click", () => selectCategory(button.dataset.category));
  });
  byId("start-button").addEventListener("click", showModeScreen);
  document.querySelectorAll("#mode-list .mode-card").forEach(button => {
    button.addEventListener("click", () => selectMode(button.dataset.mode));
  });
  byId("mode-back-button").addEventListener("click", () => showScreen("start"));
  byId("hint-button").addEventListener("click", useHint);
  byId("next-button").addEventListener("click", nextQuestion);
  byId("quit-button").addEventListener("click", quitGame);
  byId("replay-button").addEventListener("click", startNewRound);
  byId("retry-button").addEventListener("click", startRetry);
  byId("home-button").addEventListener("click", () => showScreen("start"));
  showScreen("start");
}

// tests.html에는 시작 화면이 없으므로 앱을 띄우지 않고 함수만 쓴다.
if (document.getElementById("screen-start")) initApp();

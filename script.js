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

// ---- 여기부터 화면 (DOM) ----

// 모드별 차이는 이 표에 모은다. 1단계는 연습만 있다. (PRD 5장)
const MODES = {
  practice: { label: "연습", timeLimit: null, hint: false, ranked: false },
};

const state = {
  category: null,
  mode: "practice",
  questions: [], // 이번 판 문항 (섞인 순서, 섞인 보기)
  index: 0,      // 현재 문항 위치
  score: 0,
};

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

function startGame() {
  state.questions = buildRound(QUESTIONS, state.category);
  state.index = 0;
  state.score = 0;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  byId("quiz-progress").textContent =
    `${state.category} · ${MODES[state.mode].label} · ${state.index + 1}/${state.questions.length}`;
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
}

function handleAnswer(choiceIndex) {
  const q = state.questions[state.index];
  const isCorrect = choiceIndex === q.answer;
  if (isCorrect) state.score += 1;

  byId("choice-list").querySelectorAll(".choice").forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) button.classList.add("correct");
    else if (i === choiceIndex) button.classList.add("wrong");
  });
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
  byId("result-title").textContent = `${state.category} · ${MODES[state.mode].label}`;
  byId("result-score").textContent = `${formatScore(state.score)} / ${state.questions.length}`;
  showScreen("result");
}

function quitGame() {
  if (confirm("그만두면 기록이 저장되지 않아요. 처음으로 갈까요?")) showScreen("start");
}

function initApp() {
  validateQuestions(QUESTIONS).forEach(error => console.error(`[문항 검사] ${error}`));

  document.querySelectorAll("#category-list .option").forEach(button => {
    button.addEventListener("click", () => selectCategory(button.dataset.category));
  });
  byId("start-button").addEventListener("click", startGame);
  byId("next-button").addEventListener("click", nextQuestion);
  byId("quit-button").addEventListener("click", quitGame);
  byId("replay-button").addEventListener("click", startGame);
  byId("home-button").addEventListener("click", () => showScreen("start"));
  showScreen("start");
}

// tests.html에는 시작 화면이 없으므로 앱을 띄우지 않고 함수만 쓴다.
if (document.getElementById("screen-start")) initApp();

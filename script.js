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

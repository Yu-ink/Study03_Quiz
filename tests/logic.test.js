// script.js의 순수 함수 테스트.
const { test, assert, assertEqual } = TestHarness;

// ---- shuffle ----

test('shuffle: 원소는 그대로이고 순서만 바뀐다', () => {
  const result = shuffle([1, 2, 3, 4, 5]);
  assertEqual(result.slice().sort(), [1, 2, 3, 4, 5]);
});

test('shuffle: 원본 배열을 바꾸지 않는다', () => {
  const original = [1, 2, 3, 4];
  shuffle(original);
  assertEqual(original, [1, 2, 3, 4]);
});

test('shuffle: random이 항상 0이면 Fisher–Yates 결과가 [2, 3, 4, 1]이다', () => {
  assertEqual(shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1]);
});

test('shuffle: random이 1에 가까우면 순서가 그대로다', () => {
  assertEqual(shuffle([1, 2, 3, 4], () => 0.999), [1, 2, 3, 4]);
});

// ---- formatScore ----

test('formatScore: 정수는 소수점 없이 쓴다', () => {
  assertEqual(formatScore(8), '8');
  assertEqual(formatScore(0), '0');
  assertEqual(formatScore(10), '10');
});

test('formatScore: 0.5 단위는 소수점 한 자리로 쓴다', () => {
  assertEqual(formatScore(7.5), '7.5');
  assertEqual(formatScore(0.5), '0.5');
});

// ---- validateQuestion / validateQuestions ----

function makeQuestion(overrides) {
  return Object.assign({
    id: 'science-99',
    category: '과학',
    question: '물의 화학식은?',
    choices: ['H₂O', 'CO₂', 'O₂', 'NaCl'],
    answer: 0,
    explanation: '물 분자는 수소 원자 2개와 산소 원자 1개로 이루어진다.',
    source: { name: '테스트 출처', url: 'https://example.com/water' }
  }, overrides);
}

// 카테고리마다 10개씩, 형식이 올바른 40문항
function makeValidSet() {
  return CATEGORIES.flatMap((category, c) =>
    Array.from({ length: 10 }, (_, i) => makeQuestion({ id: `c${c}-${i}`, category }))
  );
}

test('validateQuestion: 올바른 문항은 오류가 없다', () => {
  assertEqual(validateQuestion(makeQuestion()), []);
});

test('validateQuestion: 알 수 없는 카테고리를 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ category: '수학' })).length, 1);
});

test('validateQuestion: 보기가 4개가 아니면 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ choices: ['A', 'B', 'C'] })).length, 1);
});

test('validateQuestion: 같은 보기가 있으면 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ choices: ['A', 'B', 'C', 'A'] })).length, 1);
});

test('validateQuestion: 빈 보기를 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ choices: ['A', 'B', 'C', ' '] })).length, 1);
});

test('validateQuestion: answer가 0~3의 정수가 아니면 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ answer: 4 })).length, 1);
  assertEqual(validateQuestion(makeQuestion({ answer: -1 })).length, 1);
  assertEqual(validateQuestion(makeQuestion({ answer: '0' })).length, 1);
});

test('validateQuestion: 빈 문제, 빈 해설, 빈 id를 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ question: '' })).length, 1);
  assertEqual(validateQuestion(makeQuestion({ explanation: '  ' })).length, 1);
  assertEqual(validateQuestion(makeQuestion({ id: '' })).length, 1);
});

test('validateQuestion: 출처가 없거나 URL이 https가 아니면 잡는다', () => {
  assertEqual(validateQuestion(makeQuestion({ source: undefined })).length, 2);
  assertEqual(validateQuestion(makeQuestion({ source: { name: '', url: 'https://a.b' } })).length, 1);
  assertEqual(validateQuestion(makeQuestion({ source: { name: '출처', url: 'http://a.b' } })).length, 1);
});

test('validateQuestions: 카테고리마다 10개인 올바른 40문항은 오류가 없다', () => {
  assertEqual(validateQuestions(makeValidSet()), []);
});

test('validateQuestions: id 중복을 잡는다', () => {
  const set = makeValidSet();
  set[1].id = set[0].id;
  const errors = validateQuestions(set);
  assertEqual(errors.length, 1);
  assert(errors[0].includes('중복'), errors[0]);
});

test('validateQuestions: 전체 개수와 카테고리별 개수를 잡는다', () => {
  const set = makeValidSet().slice(1); // 한국사가 9개, 전체 39개
  const errors = validateQuestions(set);
  assertEqual(errors.length, 2);
});

test('validateQuestions: 각 문항의 오류도 함께 모은다', () => {
  const set = makeValidSet();
  set[0].answer = 9;
  assertEqual(validateQuestions(set).length, 1);
});

// ---- prepareQuestion / buildRound ----

test('prepareQuestion: 보기를 섞고 정답 위치를 정답 보기 내용에 맞춰 다시 계산한다', () => {
  const q = makeQuestion({ choices: ['A', 'B', 'C', 'D'], answer: 0 });
  const prepared = prepareQuestion(q, () => 0); // shuffle 결과 [B, C, D, A]
  assertEqual(prepared.choices, ['B', 'C', 'D', 'A']);
  assertEqual(prepared.answer, 3);
});

test('prepareQuestion: 원본 문항을 바꾸지 않는다', () => {
  const q = makeQuestion({ choices: ['A', 'B', 'C', 'D'], answer: 1 });
  prepareQuestion(q, () => 0);
  assertEqual(q.choices, ['A', 'B', 'C', 'D']);
  assertEqual(q.answer, 1);
});

test('prepareQuestion: 무작위로 섞어도 정답 보기 내용은 그대로다', () => {
  const q = makeQuestion({ choices: ['A', 'B', 'C', 'D'], answer: 2 });
  for (let i = 0; i < 20; i++) {
    const prepared = prepareQuestion(q);
    assertEqual(prepared.choices[prepared.answer], 'C');
  }
});

function makePool() {
  const history = Array.from({ length: 12 }, (_, i) => makeQuestion({ id: `h-${i}`, category: '한국사' }));
  const science = Array.from({ length: 3 }, (_, i) => makeQuestion({ id: `s-${i}`, category: '과학' }));
  return history.concat(science);
}

test('buildRound: 고른 카테고리 문항만 최대 10개 고른다', () => {
  const round = buildRound(makePool(), '한국사');
  assertEqual(round.length, 10);
  assert(round.every(q => q.category === '한국사'), '다른 카테고리 문항이 섞임');
  assertEqual(new Set(round.map(q => q.id)).size, 10);
});

test('buildRound: 문항이 10개보다 적으면 있는 만큼만 고른다', () => {
  assertEqual(buildRound(makePool(), '과학').length, 3);
});

test('buildRound: 모든 문항의 정답 보기 내용이 원본과 같다', () => {
  const pool = makePool();
  buildRound(pool, '한국사').forEach(q => {
    const original = pool.find(p => p.id === q.id);
    assertEqual(q.choices[q.answer], original.choices[original.answer], q.id);
  });
});

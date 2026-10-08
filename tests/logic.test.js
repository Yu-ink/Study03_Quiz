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

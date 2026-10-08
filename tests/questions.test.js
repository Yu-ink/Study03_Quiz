// 실제 QUESTIONS 데이터 검사. 카테고리를 추가할 때마다 아래에 checkCategory 호출을 더한다.

function checkCategory(category) {
  TestHarness.test(`${category}: 10문항이 모두 형식 검사를 통과한다`, () => {
    const items = QUESTIONS.filter(q => q.category === category);
    TestHarness.assertEqual(items.length, QUESTIONS_PER_ROUND, `${category} 문항 수`);
    TestHarness.assertEqual(items.flatMap(validateQuestion), [], `${category} 형식 오류`);
  });
}

checkCategory('한국사');
checkCategory('세계지리');
checkCategory('과학');

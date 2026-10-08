// 상식 퀴즈 문항 40개. 규칙은 PRD.md 3장을 따른다.
// answer는 choices 안에서 정답의 위치(0~3)다. 게임에서는 보기를 섞어서 보여 준다.
const QUESTIONS = [
  // ---- 한국사 ----
  {
    id: "history-01",
    category: "한국사",
    question: "훈민정음을 만들어 1446년에 반포한 조선의 왕은?",
    choices: ["세종", "태종", "세조", "성종"],
    answer: 0,
    explanation: "세종은 1443년에 훈민정음을 만들고 1446년에 『훈민정음』이라는 책으로 반포했다.",
    source: { name: "한국민족문화대백과사전 「한글」", url: "https://encykorea.aks.ac.kr/Article/E0061508" }
  },
  {
    id: "history-02",
    category: "한국사",
    question: "918년에 고려를 세운 인물은?",
    choices: ["왕건", "궁예", "견훤", "이성계"],
    answer: 0,
    explanation: "고려는 918년 개성 출신 왕건이 세운 나라로, 936년에 후삼국을 통합했다.",
    source: { name: "한국민족문화대백과사전 「고려」", url: "https://encykorea.aks.ac.kr/Article/E0003424" }
  },
  {
    id: "history-03",
    category: "한국사",
    question: "임진왜란 중인 1592년 한산도 대첩에서 학익진으로 일본 수군을 크게 무찌른 조선의 장수는?",
    choices: ["이순신", "권율", "김시민", "곽재우"],
    answer: 0,
    explanation: "이순신은 1592년 7월 한산섬 앞바다에서 학익진을 펼쳐 일본 수군의 주력을 무찔렀다.",
    source: { name: "한국민족문화대백과사전 「한산도대첩」", url: "https://encykorea.aks.ac.kr/Article/E0061676" }
  },
  {
    id: "history-04",
    category: "한국사",
    question: "전국적인 독립 만세 운동인 3·1 운동이 일어난 해는?",
    choices: ["1919년", "1910년", "1926년", "1945년"],
    answer: 0,
    explanation: "3·1 운동은 1919년 3월 1일을 기해 전국에서 일어난 독립 만세 운동이다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "history-05",
    category: "한국사",
    question: "『삼국유사』에 신라 선덕여왕 때 쌓았다고 기록된, 경주에 있는 천문 관측 시설은?",
    choices: ["첨성대", "석굴암", "불국사", "다보탑"],
    answer: 0,
    explanation: "경주 첨성대는 『삼국유사』에 선덕여왕 때 쌓았다는 기록이 있는 신라의 천문 관측 시설이다.",
    source: { name: "한국민족문화대백과사전 「경주 첨성대」", url: "https://encykorea.aks.ac.kr/Article/E0002925" }
  },
  {
    id: "history-06",
    category: "한국사",
    question: "세조 때 편찬을 시작해 성종 때 완성되어 시행된 조선의 기본 법전은?",
    choices: ["경국대전", "삼국사기", "농사직설", "동의보감"],
    answer: 0,
    explanation: "『경국대전』은 세조 때 편찬을 시작해 성종 때인 1485년부터 시행된 조선의 기본 법전이다.",
    source: { name: "한국민족문화대백과사전 「경국대전」", url: "https://encykorea.aks.ac.kr/Article/E0002296" }
  },
  {
    id: "history-07",
    category: "한국사",
    question: "백제 성왕이 538년에 웅진에서 옮긴 새 도읍은?",
    choices: ["사비", "웅진", "위례성", "국내성"],
    answer: 0,
    explanation: "백제 성왕은 538년에 도읍을 웅진(지금의 공주)에서 사비(지금의 부여)로 옮겼다.",
    source: { name: "한국민족문화대백과사전 「사비천도」", url: "https://encykorea.aks.ac.kr/Article/E0071959" }
  },
  {
    id: "history-08",
    category: "한국사",
    question: "1894년 동학농민군을 이끌었으며 '녹두장군'이라 불린 인물은?",
    choices: ["전봉준", "최제우", "김옥균", "홍경래"],
    answer: 0,
    explanation: "전봉준은 1894년 동학농민군을 이끈 대장으로, 몸이 왜소해 녹두라 불리다가 녹두장군이란 별명이 생겼다.",
    source: { name: "한국민족문화대백과사전 「전봉준」", url: "https://encykorea.aks.ac.kr/Article/E0049437" }
  },
  {
    id: "history-09",
    category: "한국사",
    question: "1876년 강화부에서 조선과 일본이 맺은 불평등 조약은?",
    choices: ["강화도 조약", "을사조약", "제물포 조약", "한일 병합 조약"],
    answer: 0,
    explanation: "강화도 조약(조일수호조규)은 1876년 2월 강화부에서 조선과 일본이 맺은 불평등 조약이다.",
    source: { name: "한국민족문화대백과사전 「강화도조약」", url: "https://encykorea.aks.ac.kr/Article/E0001508" }
  },
  {
    id: "history-10",
    category: "한국사",
    question: "1919년 4월 11일 대한민국 임시 정부가 수립된 도시는?",
    choices: ["상하이", "베이징", "도쿄", "하얼빈"],
    answer: 0,
    explanation: "대한민국 임시 정부는 1919년 4월 11일 중국 상하이에서 수립되었다.",
    source: { name: "한국민족문화대백과사전 「대한민국 임시정부」", url: "https://encykorea.aks.ac.kr/Article/E0015017" }
  },

  // ---- 세계지리 ----
  {
    id: "geography-01",
    category: "세계지리",
    question: "2026년 현재, 국토 면적 기준으로 세계에서 가장 넓은 나라는?",
    choices: ["러시아", "캐나다", "중국", "미국"],
    answer: 0,
    explanation: "러시아는 세계에서 가장 넓은 나라로, 두 번째로 넓은 캐나다의 거의 두 배 면적이다.",
    source: { name: "브리태니커 백과사전 「Russia」", url: "https://www.britannica.com/place/Russia" }
  },
  {
    id: "geography-02",
    category: "세계지리",
    question: "오스트레일리아의 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "퍼스"],
    answer: 0,
    explanation: "오스트레일리아 연방의 수도는 시드니나 멜버른이 아니라 캔버라다.",
    source: { name: "브리태니커 백과사전 「Canberra」", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "geography-03",
    category: "세계지리",
    question: "2026년 현재, 해발고도(해수면으로부터의 높이) 기준으로 세계에서 가장 높은 산은?",
    choices: ["에베레스트산", "K2", "칸첸중가", "데날리"],
    answer: 0,
    explanation: "에베레스트산은 해발 8,849m로 세계에서 가장 높은 산이다.",
    source: { name: "브리태니커 백과사전 「Mount Everest」", url: "https://www.britannica.com/place/Mount-Everest" }
  },
  {
    id: "geography-04",
    category: "세계지리",
    question: "안데스산맥이 있는 대륙은?",
    choices: ["남아메리카", "아프리카", "유럽", "오세아니아"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카의 산맥으로, 대륙 남쪽 끝에서 카리브해 연안까지 약 8,900km 이어진다.",
    source: { name: "브리태니커 백과사전 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "geography-05",
    category: "세계지리",
    question: "캐나다의 수도는?",
    choices: ["오타와", "토론토", "밴쿠버", "몬트리올"],
    answer: 0,
    explanation: "캐나다의 수도는 온타리오주 남동부에 있는 오타와다.",
    source: { name: "브리태니커 백과사전 「Ottawa」", url: "https://www.britannica.com/place/Ottawa" }
  },
  {
    id: "geography-06",
    category: "세계지리",
    question: "아프리카 북동부를 지나 북쪽으로 흐르다가 지중해로 흘러드는 강은?",
    choices: ["나일강", "아마존강", "갠지스강", "미시시피강"],
    answer: 0,
    explanation: "나일강은 적도 남쪽에서 시작해 아프리카 북동부를 거쳐 북쪽으로 흐르다가 지중해로 들어간다.",
    source: { name: "브리태니커 백과사전 「Nile River」", url: "https://www.britannica.com/place/Nile-River" }
  },
  {
    id: "geography-07",
    category: "세계지리",
    question: "2026년 현재, 면적 기준으로 세계에서 가장 넓은 대양은?",
    choices: ["태평양", "대서양", "인도양", "북극해"],
    answer: 0,
    explanation: "태평양은 가장 넓은 대양으로, 다음으로 넓은 대서양의 두 배 면적이며 지구 표면의 약 3분의 1을 차지한다.",
    source: { name: "브리태니커 백과사전 「Pacific Ocean」", url: "https://www.britannica.com/place/Pacific-Ocean" }
  },
  {
    id: "geography-08",
    category: "세계지리",
    question: "브라질에서 나라 전역에 걸쳐 쓰이는 언어는?",
    choices: ["포르투갈어", "스페인어", "영어", "프랑스어"],
    answer: 0,
    explanation: "브라질에서는 포르투갈어가 나라 전역에서 쓰이며, 아마존 유역의 일부 원주민 공동체는 원주민 언어도 쓴다.",
    source: { name: "브리태니커 백과사전 「Brazil」", url: "https://www.britannica.com/place/Brazil" }
  },
  {
    id: "geography-09",
    category: "세계지리",
    question: "사하라 사막이 있는 대륙은?",
    choices: ["아프리카", "아시아", "오세아니아", "남아메리카"],
    answer: 0,
    explanation: "사하라 사막은 아프리카 북부를 거의 다 채우고 있는 사막이다.",
    source: { name: "브리태니커 백과사전 「Sahara」", url: "https://www.britannica.com/place/Sahara-desert-Africa" }
  },
  {
    id: "geography-10",
    category: "세계지리",
    question: "튀르키예의 수도는?",
    choices: ["앙카라", "이스탄불", "이즈미르", "안탈리아"],
    answer: 0,
    explanation: "튀르키예의 수도는 이스탄불이 아니라 1923년에 수도로 선포된 앙카라다.",
    source: { name: "브리태니커 백과사전 「Ankara」", url: "https://www.britannica.com/place/Ankara" }
  },

  // ---- 과학 ----
  {
    id: "science-01",
    category: "과학",
    question: "물의 화학식은?",
    choices: ["H₂O", "CO₂", "O₂", "NaCl"],
    answer: 0,
    explanation: "물 분자는 수소와 산소로 이루어지며 화학식은 H₂O다.",
    source: { name: "브리태니커 백과사전 「water」", url: "https://www.britannica.com/science/water" }
  },
  {
    id: "science-02",
    category: "과학",
    question: "2026년 현재 태양계 행성 중, 태양과의 평균 거리 기준으로 태양에 가장 가까운 행성은?",
    choices: ["수성", "금성", "지구", "화성"],
    answer: 0,
    explanation: "수성은 태양에서 평균 약 5,800만 km(0.4 AU) 떨어져 있어 태양에 가장 가까운 행성이다.",
    source: { name: "NASA Science 「Mercury: Facts」", url: "https://science.nasa.gov/mercury/facts/" }
  },
  {
    id: "science-03",
    category: "과학",
    question: "원자 번호가 1번인 원소는?",
    choices: ["수소", "헬륨", "탄소", "산소"],
    answer: 0,
    explanation: "수소는 원소 기호 H, 원자 번호 1번인 원소다.",
    source: { name: "브리태니커 백과사전 「hydrogen」", url: "https://www.britannica.com/science/hydrogen" }
  },
  {
    id: "science-04",
    category: "과학",
    question: "식물이 빛 에너지를 이용해 이산화탄소와 물로 탄수화물과 산소를 만드는 과정은?",
    choices: ["광합성", "호흡", "증산", "발효"],
    answer: 0,
    explanation: "광합성은 녹색 식물 등이 빛 에너지를 이용해 이산화탄소와 물을 탄수화물과 산소로 바꾸는 과정이다.",
    source: { name: "브리태니커 백과사전 「photosynthesis」", url: "https://www.britannica.com/science/photosynthesis" }
  },
  {
    id: "science-05",
    category: "과학",
    question: "진공에서 빛의 속력은 약 얼마인가?",
    choices: ["초속 약 30만 km", "초속 약 300km", "초속 약 3만 km", "초속 약 3,000만 km"],
    answer: 0,
    explanation: "진공에서 빛의 속력은 초속 299,792,458m(약 30만 km)로 정해진 값이다.",
    source: { name: "NIST 「speed of light in vacuum」", url: "https://physics.nist.gov/cgi-bin/cuu/Value?c" }
  },
  {
    id: "science-06",
    category: "과학",
    question: "1953년 DNA의 이중 나선 구조를 밝혀낸 두 과학자는?",
    choices: ["왓슨과 크릭", "퀴리 부부", "다윈과 월리스", "뉴턴과 핼리"],
    answer: 0,
    explanation: "제임스 왓슨과 프랜시스 크릭은 로절린드 프랭클린과 모리스 윌킨스의 연구를 바탕으로 1953년 DNA 이중 나선 구조를 밝혔다.",
    source: { name: "브리태니커 백과사전 「double helix」", url: "https://www.britannica.com/science/double-helix" }
  },
  {
    id: "science-07",
    category: "과학",
    question: "해수면 높이에서 물이 끓는 온도는 섭씨 몇 도인가?",
    choices: ["100°C", "0°C", "50°C", "212°C"],
    answer: 0,
    explanation: "해수면 높이에서 물은 섭씨 100도(화씨 212도)에서 끓는다.",
    source: { name: "브리태니커 백과사전 「boiling point」", url: "https://www.britannica.com/science/boiling-point" }
  },
  {
    id: "science-08",
    category: "과학",
    question: "2026년 현재 태양계 행성 중, 질량 기준으로 가장 큰 행성은?",
    choices: ["목성", "토성", "해왕성", "지구"],
    answer: 0,
    explanation: "목성은 태양계에서 가장 큰 행성으로, 태양계의 다른 천체를 모두 합친 것의 두 배가 넘는 물질을 가지고 있다.",
    source: { name: "NASA Science 「Jupiter: Facts」", url: "https://science.nasa.gov/jupiter/facts/" }
  },
  {
    id: "science-09",
    category: "과학",
    question: "사람의 혈액에서 폐의 산소를 온몸의 조직으로 나르는 세포는?",
    choices: ["적혈구", "백혈구", "혈소판", "신경 세포"],
    answer: 0,
    explanation: "적혈구는 철을 포함한 단백질인 헤모글로빈으로 산소와 결합해, 폐에서 온몸의 조직으로 산소를 나른다.",
    source: { name: "브리태니커 백과사전 「red blood cell」", url: "https://www.britannica.com/science/red-blood-cell" }
  },
  {
    id: "science-10",
    category: "과학",
    question: "소리가 전달되지 않는 곳은?",
    choices: ["진공", "물", "공기", "철"],
    answer: 0,
    explanation: "소리는 공기나 물 같은 물질 속 압력파로 전달되므로, 물질이 없는 진공에서는 전달되지 않는다.",
    source: { name: "NASA Cosmicopia 「Energy Traveling Through Space」", url: "https://cosmicopia.gsfc.nasa.gov/qa_sp_en.html" }
  },
];

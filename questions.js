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
];

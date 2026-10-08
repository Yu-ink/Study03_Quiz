# CLAUDE 작업 지침

이 저장소에서 Claude가 작업할 때 따르는 규칙. 요구 사항의 기준 문서는 [PRD.md](PRD.md)이고, 진행 상황은 [IMPL-PLAN.md](IMPL-PLAN.md)에 있다. 이 파일과 PRD가 충돌하면 PRD를 우선한다.

## 프로젝트 요약
- 대학 1학년이 혼자 상식 공부를 하는 4지선다 퀴즈 웹 앱. 카테고리 4개(한국사, 세계지리, 과학, 예술과 문화) × 10문항 = 40문항.
- 한 판은 카테고리 1개의 10문항. 답을 고르면 바로 정답 여부, 한 줄 해설, 출처를 보여 주고, 끝나면 점수를 보여 준다.
- 모드: 연습(1단계), 스피드·힌트·틀린 문제 다시 풀기(2단계), 순위표(3단계). 단계별 범위는 PRD 9장.

## 기술 제약 (반드시 지킬 것)
- 앱 파일은 `index.html`, `style.css`, `script.js`, `questions.js` **4개뿐**이다. 새 앱 파일을 만들지 않는다. (`tests.html`, `tests/`는 개발용)
- **`file://`로 더블클릭해 실행 가능해야 한다.** ES 모듈(`import`/`export`, `type="module"`), `fetch`, 외부 라이브러리·CDN·빌드 도구 금지.
- 스크립트 로드 순서: `questions.js` → `script.js`. `questions.js`는 전역 상수 `QUESTIONS` 하나만 둔다.
- 문항 데이터(문제, 보기, 해설, 출처)는 `textContent`/`href`로만 DOM에 넣는다. `innerHTML` 금지.
- 화면은 `index.html`에 `<section>`으로 미리 두고 `hidden`으로 전환한다. 화면 전체를 JS로 만들지 않는다.
- 모드별 차이(시간 제한, 힌트, 순위표 기록)는 `script.js`의 `MODES` 설정표에 모은다.

## 구조와 책임
| 위치 | 책임 | 하면 안 되는 것 |
|---|---|---|
| `script.js` 앞부분 | 순수 함수: `shuffle`, `formatScore`, `validateQuestion(s)`, `prepareQuestion`, `buildRound` | DOM 접근, 전역 `state` 변경 |
| `script.js` 뒷부분 (`// ---- 여기부터 화면 (DOM) ----` 아래) | `MODES`, `state`, 화면 함수, `initApp` | 채점·섞기 같은 로직을 직접 구현 (순수 함수로 빼서 테스트한다) |
| `questions.js` | 문항 40개 데이터 | 로직 |

- 무작위가 필요한 순수 함수는 `random = Math.random` 인자를 받아 테스트에서 결과를 고정한다.
- `script.js` 맨 끝의 `if (document.getElementById("screen-start")) initApp();` 덕분에 `tests.html`에서는 앱이 뜨지 않는다. 이 줄을 지우지 않는다.

## 문항 규칙 (PRD 3.3)
1. 정답은 하나뿐이다. 오답 보기 3개는 출처로 분명히 틀렸다고 말할 수 있어야 한다. "모두 맞음", "정답 없음" 보기 금지.
2. 해설은 한 문장이고, `source`에는 **실제로 열어 확인한** 공신력 있는 출처(백과사전, 공공기관, 국제기구, 소장 기관)만 적는다. **위키백과·나무위키 금지.** 검색 결과 요약만 보고 적지 않는다.
3. "가장, 최대, 최소, 최고, 최초, 제일"이 문제에 있으면 기준과 시점을 함께 쓴다. 예: "2026년 현재, 면적 기준으로 세계에서 가장 넓은 대양은?"
- 출처에서 확인되지 않는 표현은 출처 표현에 맞춰 문제나 해설을 고친다.
- 출처 찾기 요령:
  - 한국민족문화대백과사전(`encykorea.aks.ac.kr`), NASA, NIST는 WebFetch로 열린다.
  - 브리태니커, 유네스코, MoMA는 WebFetch가 403으로 막히므로 브라우저 패인으로 연다.
  - CIA World Factbook은 2026년 2월에 서비스가 끝났으므로 쓰지 않는다.
- `source.name` 형식: `기관/사전 이름 「항목 이름」`.

## 작업 방식
- 기능 구현·버그 수정은 **테스트를 먼저** 쓴다: `tests/*.test.js`에 추가 → 실패 확인 → 구현 → 통과 확인.
- 완료를 주장하기 전에 자동 테스트가 전부 통과하는지 실제로 실행해 확인하고, 화면 변경은 브라우저에서 직접 확인한다.
- PRD 범위 밖 기능이나 다음 단계 기능은 요청 없이 추가하지 않는다.
- 코드 주석과 화면 문구는 한국어, 식별자는 영어로 쓴다. 화면 문구는 PRD 문구를 그대로 쓴다.
- 단계를 시작하기 전에 `docs/superpowers/plans/`에 상세 계획을 쓰고, 끝나면 [IMPL-PLAN.md](IMPL-PLAN.md) 진행표를 갱신한다.

## 테스트 실행
- 자동 테스트: `tests.html`을 브라우저로 열고 탭 제목이 `PASS (n/n)`인지 본다.
  - 에이전트(Node 없음): 헤드리스 Chrome으로 실행해 제목과 실패 항목만 읽는다.
    ```bash
    "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom "file:///D:/study03_Quiz/tests.html" 2>/dev/null | grep -oE '<title>[^<]*</title>|<li class="fail">[^<]*'
    ```
- 화면 확인(에이전트): 브라우저 패인은 `file://`을 열지 못한다.
  1. Bash에서 `python -m http.server 8123 --bind 127.0.0.1 --directory D:/study03_Quiz`를 백그라운드로 띄운다.
  2. `launch.json`에 `"url": "http://localhost:8123"`만 넣은 설정으로 `preview_start`에 연결한다.
  - 미리보기 도구가 직접 띄운 서버는 이 폴더에 접근하지 못했다.
  - `file://` 동작은 헤드리스 Chrome의 `--dump-dom`으로 확인한다.
- 테스트 코드: `tests/harness.js`(도구), `tests/logic.test.js`(순수 함수), `tests/questions.test.js`(실제 문항 데이터). 새 테스트 파일은 `tests.html`에 `<script>`로 추가한다.
- 수동 점검: PRD 10.2 체크리스트.

## Git
- 저장소: https://github.com/Yu-ink/Study03_Quiz (Public). 기본 브랜치 `main`. 단계 작업은 `feat/stage<N>` 브랜치에서 하고 끝나면 `main`에 합친다.
- 커밋 작성자는 저장소 로컬 설정(`Yu-ink`, noreply 이메일)을 쓴다.
- 커밋 메시지: `feat:`/`fix:`/`test:`/`docs:` + 한국어 요약.

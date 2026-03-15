# Pico Buddy (피코 버디) — AI 피코 학습 도우미

## 프로젝트 개요

Raspberry Pi Pico 2 WH + Grove Shield + 33종 센서/액추에이터를 위한 **AI 튜터 웹앱**.
센서별 배선 가이드, MicroPython 코드, 에러 진단, 용어 사전을 AI 채팅과 통합 제공.

- **대상**: 피지컬 컴퓨팅 초심자 (중고등학생)
- **배포**: https://visual-pico.vercel.app
- **GitHub**: https://github.com/greatsong/pico-buddy

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | React | 19 |
| 빌드 | Vite | 8 |
| 스타일 | Tailwind CSS | 4 |
| 상태관리 | Zustand | 5 |
| AI | Claude API (claude-sonnet-4-6) | SSE 스트리밍 |
| 백엔드 | Express 5 (로컬) / Vercel Serverless (배포) | - |
| 마크다운 | react-markdown + remark-gfm | - |
| 아이콘 | lucide-react | - |

## 포트

| 포트 | 용도 |
|------|------|
| **4017** | Vite 개발 서버 |
| **4018** | Express API 프록시 |

## 디렉토리 구조

```
visual-pico/
├── .claude/launch.json       # Claude Code 개발 서버 설정
├── .env                      # ANTHROPIC_API_KEY
├── api/                      # Vercel Serverless Functions
│   ├── chat.js               # Claude API SSE 스트리밍
│   ├── fetch-url.js          # URL 콘텐츠 분석
│   └── analyze-image.js      # 배선 사진 분석
├── lib/
│   └── claudeStream.js       # SSE 스트리밍 유틸리티
├── server/
│   └── index.js              # Express 로컬 프록시 (포트 4018)
├── src/
│   ├── App.jsx               # 메인 레이아웃 (2패널)
│   ├── main.jsx              # React 엔트리
│   ├── index.css             # Tailwind 베이스
│   ├── components/
│   │   ├── SensorCatalog.jsx     # 33종 센서 카탈로그 (7카테고리)
│   │   ├── chat/
│   │   │   ├── ChatPanel.jsx     # AI 채팅 (SSE 스트리밍, 에러 진단)
│   │   │   ├── ErrorDiagnosis.jsx # 에러 메시지 자동 진단
│   │   │   ├── GlossaryTooltip.jsx # 용어 툴팁
│   │   │   ├── ImageUpload.jsx   # 배선 사진 업로드
│   │   │   ├── MiniChallenge.jsx # 미니 챌린지
│   │   │   ├── MistakeWarning.jsx # 실수 경고
│   │   │   └── SuggestedActions.jsx # 추천 질문
│   │   ├── board/
│   │   │   ├── PicoBoard.jsx     # Pico 보드 시각화
│   │   │   └── WiringGuide.jsx   # Grove 배선 가이드
│   │   ├── code/
│   │   │   └── AnnotatedCode.jsx # 코드 줄별 해설
│   │   └── common/
│   │       ├── SensorImage.jsx   # 센서 이미지
│   │       └── TipsPanel.jsx     # 팁 패널
│   ├── data/
│   │   ├── sensors.js        # 33종 센서 DB (핵심 데이터)
│   │   ├── pins.js           # Pico 핀 맵
│   │   ├── errorPatterns.js  # 에러 패턴 매칭
│   │   ├── glossary.js       # 용어 사전
│   │   ├── challenges.js     # 미니 챌린지
│   │   └── commonMistakes.js # 흔한 실수 패턴
│   ├── stores/
│   │   ├── appStore.js       # 앱 상태 (센서, 쉴드모드, UI)
│   │   ├── chatStore.js      # 채팅 메시지 상태
│   │   └── progressStore.js  # 학습 진행 상태
│   ├── lib/
│   │   ├── api.js            # Claude API 호출 래퍼
│   │   ├── contextBuilder.js # AI 시스템 프롬프트 빌더
│   │   └── chatLogger.js     # 채팅 기록 마크다운 저장
│   └── design/
│       └── tokens.js         # 디자인 토큰
├── package.json
├── vite.config.js
└── vercel.json
```

## 핵심 데이터: sensors.js

33종 센서/액추에이터를 7개 카테고리로 분류:
- 환경 (DHT20, SCD41, SGP30, BMP280, 토양수분 등)
- 소리/진동 (소리, 진동, 부저, 스피커)
- 빛/색상 (빛, UV, 색상, LED Bar, RGB LED)
- 거리/움직임 (초음파, PIR, ADXL345)
- 신체 (심박)
- 입력 (로터리, 조이스틱, 버튼, 터치)
- 출력 (릴레이, 서보, OLED, 4-Digit Display)

각 센서 객체: `id, name, nameEn, category, icon, grove, i2cAddress, pins, connection, description, codeExample, tips`

## AI 시스템 (contextBuilder.js)

- 선택된 센서에 따라 시스템 프롬프트 자동 생성
- 센서 사양, 연결 정보, 코드 예제를 맥락에 주입
- Grove Shield 모드 / 직접 연결 모드 분기
- 에러 패턴 자동 감지 + 진단 카드 표시
- 학습된 용어 추적 → 이미 배운 용어는 설명 생략

## 개발 명령어

```bash
npm run dev        # Vite 개발 서버 (포트 4017)
npm run server     # Express API 프록시 (포트 4018)
npm run dev:all    # 둘 다 동시 실행
npm run build      # 프로덕션 빌드
```

## 환경 변수

```
ANTHROPIC_API_KEY=sk-ant-...   # Claude API 키 (필수)
```

## 연관 프로젝트

- **ai-physical-computing**: 15차시 정규 수업 교재 (Astro/Starlight 정적 사이트)
  - 경로: `/Users/greatsong/greatsong-project/ai-physical-computing/`
  - 센서 데이터 구조가 유사 (sensors.ts ↔ sensors.js)
- **pico-makers** (계획 중): 커리큘럼 전체를 아우르는 AI 동반자 웹앱
  - visual-pico의 코드를 재활용하여 확장
  - 플랜: `/Users/greatsong/.claude/plans/tidy-wandering-thimble.md`

## 코딩 컨벤션

- UI 텍스트, 주석: 한국어
- 코드 (변수명, 함수명): 영어
- 컴포넌트: JSX (함수형)
- 상태: Zustand store
- API: Vercel Serverless (배포) / Express 프록시 (개발)

## 학운위 심의

- tonggwa 파이프라인에 등록됨: `/Users/greatsong/greatsong-project/tonggwa/pipeline/config.yaml`
- 개인정보 미수집 (localStorage만 사용, 인증 없음)
- Claude API 사용 (센서 질문 텍스트만 전송, 개인식별정보 없음)

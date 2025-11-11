# TEAZEN 혈당 캘린더

TEAZEN 브랜드의 혈당 관리 및 마케팅 인사이트 대시보드입니다.

> 🚀 **실제 데이터 기반**: Google Sheets API 연동
> 🤖 **AI 분석**: OpenAI GPT API 활용
> 📊 **실시간 인사이트**: 검색 트렌드 분석 및 마케팅 제안

## 주요 기능

### 📅 캘린더
- 연도/월 선택 UI (1열 나열 방식)
- 실시간 최종 업데이트 시간 표시
- 업데이트 버튼으로 데이터 새로고침
- **월 클릭 시 해당 월 검색량 높은 순으로 키워드 자동 정렬**

### 🤖 AI 인사이트
- **실제 GPT-4 API 활용** (OpenAI)
- 로딩 애니메이션 → 펼쳐지는 효과
- 가운데 정렬 및 반응형 디자인
- 선택된 키워드의 실제 검색 데이터 기반 인사이트
- 키워드 태그 색상 구분

### 🏷️ 키워드 선택
- **다중 선택 가능** (여러 키워드 동시 비교)
- 키워드별 고유 색상 팔레트 (8가지 색상)
- **검색 기능** - 많은 키워드에서 빠르게 찾기
- **스크롤 지원** - 무한 확장 가능
- **마우스 호버 시 연령대 분포 그래프 표시**
- 각 키워드의 검색량 실시간 표시

### 📊 검색량 추이 차트
- **실제 Google Sheets 데이터 기반**
- 다중 키워드 동시 표시 및 비교
- 키워드별 색상 자동 구분
- 기간 선택 토글: 1일, 7일, 1주일, 한달, 3달, 6달, 1년, 2년
- **실시간 남녀 비율 계산 및 표시**
- 반응형 그래프

### 🔽 푸터
- Copyright FINFLOW

## 🚀 빠른 시작

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
# Google Sheets API (클라이언트 사이드)
VITE_GOOGLE_SHEETS_API_KEY=your_google_api_key_here

# OpenAI API (서버 사이드 전용)
OPENAI_API_KEY=your_openai_api_key_here

# 참고: 구글 시트 ID는 코드에 고정
# https://docs.google.com/spreadsheets/d/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/
```

### 2. 패키지 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

### 3. 자세한 설정 가이드

📖 [**SETUP_GUIDE.md**](./SETUP_GUIDE.md) 파일을 참고하세요!

- Google Sheets API 설정 방법
- OpenAI API 키 발급 방법
- 데이터 형식 및 예시
- Vercel 배포 방법
- 트러블슈팅

## 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 번들러 및 개발 서버
- **Recharts** - 데이터 시각화

### Backend (Serverless)
- **Vercel Functions** - API 라우트
- **OpenAI API** - AI 인사이트 생성

### Data Source
- **Google Sheets API** - 실시간 데이터 동기화

## 프로젝트 구조

```
.
├── api/
│   └── generate-insight.ts    # OpenAI API 라우트 (Vercel Serverless)
├── src/
│   ├── components/
│   │   ├── Header.tsx          # 헤더
│   │   ├── Calendar.tsx        # 캘린더 (연도/월 선택)
│   │   ├── AIInsight.tsx       # AI 인사이트 (GPT 연동)
│   │   ├── KeywordList.tsx     # 키워드 리스트 (검색, 정렬, 호버)
│   │   ├── TrendChart.tsx      # 검색량 추이 차트
│   │   ├── AgeDistributionChart.tsx  # 연령대 분포 차트
│   │   └── Footer.tsx          # 푸터
│   ├── services/
│   │   ├── googleSheets.ts     # Google Sheets API 연동
│   │   └── openai.ts           # OpenAI API 호출
│   ├── hooks/
│   │   └── useKeywordData.ts   # 데이터 로드 및 관리 Hook
│   ├── types/
│   │   └── index.ts            # TypeScript 타입 정의
│   ├── App.tsx                 # 메인 앱
│   └── main.tsx                # 엔트리 포인트
├── vercel.json                 # Vercel 배포 설정
├── SETUP_GUIDE.md              # 상세 설정 가이드
└── README.md                   # 프로젝트 문서
```

## 데이터 형식 (Google Sheets)

### 스프레드시트 구조

| keyword | year | month | searchVolume | maleRatio | femaleRatio | age10s | age20s | age30s | age40s | age50s | age60plus |
|---------|------|-------|--------------|-----------|-------------|--------|--------|--------|--------|--------|-----------|
| 삼겹살  | 2025 | 1     | 15000        | 52.5      | 47.5        | 8      | 25     | 28     | 22     | 12     | 5         |
| 치킨    | 2025 | 1     | 22000        | 48.3      | 51.7        | 12     | 30     | 25     | 18     | 10     | 5         |

### 데이터 설명
- `keyword`: 검색 키워드
- `year`, `month`: 년도와 월
- `searchVolume`: 검색량
- `maleRatio`, `femaleRatio`: 남녀 성비 (%)
- `age10s ~ age60plus`: 연령대별 비율 (%)

## 색상 팔레트

키워드별 자동 할당 색상:

| 순서 | 색상 코드 | 설명 |
|------|-----------|------|
| 1 | `#8b7aff` | 보라 |
| 2 | `#ff6b9d` | 핑크 |
| 3 | `#4ecdc4` | 청록 |
| 4 | `#ffa502` | 주황 |
| 5 | `#ff6348` | 빨강 |
| 6 | `#a29bfe` | 연보라 |
| 7 | `#fd79a8` | 연핑크 |
| 8 | `#00b894` | 녹청 |

## 주요 특징

### ✅ 실제 데이터 기반
- Google Sheets를 데이터베이스로 활용
- 실시간 데이터 동기화
- 샘플 데이터 자동 생성 (API 키 없을 시)

### ✅ AI 인사이트
- OpenAI GPT-4 API 활용
- 실제 검색 데이터 분석
- 마케팅 전략 제안

### ✅ 고급 UI/UX
- 키워드 호버 시 연령대 그래프 팝업
- 검색 및 필터링 기능
- 무한 스크롤 지원
- 반응형 디자인

### ✅ 보안
- API 키는 서버 사이드에서만 사용
- 환경변수로 민감 정보 관리
- CORS 설정

## 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

환경변수는 Vercel 대시보드에서 설정하세요.

자세한 내용은 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.

## 라이선스

Copyright © FINFLOW. All rights reserved.

## 개발자

- **FINFLOW** - [웹사이트](https://finflow.com)
- 기술 지원: support@finflow.com


# 🚀 빠른 시작 가이드

1분 만에 TEAZEN 혈당 캘린더를 실행하세요!

## Step 1: 프로젝트 클론 및 패키지 설치

```bash
git clone <repository-url>
cd teazen-calendar
npm install
```

## Step 2: 환경변수 설정

`.env` 파일을 프로젝트 루트에 생성:

```bash
# .env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
VITE_GOOGLE_SHEETS_ID=your_sheet_id
OPENAI_API_KEY=your_openai_key
```

### 🔑 API 키가 없나요?

**걱정 마세요!** API 키 없이도 샘플 데이터로 실행할 수 있습니다.

다만, AI 인사이트는 폴백 메시지가 표시됩니다.

## Step 3: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속!

## Step 4: Google Sheets 준비 (선택사항)

### 방법 1: 샘플 시트 복사 (추천)

1. [샘플 스프레드시트](https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_ID/copy) 복사
2. 스프레드시트 ID를 `.env`에 추가

### 방법 2: 새로 만들기

1. Google Sheets에서 새 시트 생성
2. 다음 헤더 추가:
   ```
   keyword | year | month | searchVolume | maleRatio | femaleRatio | age10s | age20s | age30s | age40s | age50s | age60plus
   ```
3. 데이터 입력:
   ```
   삼겹살 | 2025 | 1 | 15000 | 52.5 | 47.5 | 8 | 25 | 28 | 22 | 12 | 5
   치킨 | 2025 | 1 | 22000 | 48.3 | 51.7 | 12 | 30 | 25 | 18 | 10 | 5
   ```
4. "공유" → "링크가 있는 모든 사용자" → "뷰어"

## API 키 발급 (선택사항)

### Google Sheets API

1. [Google Cloud Console](https://console.cloud.google.com/)
2. "API 및 서비스" → "라이브러리" → "Google Sheets API" 활성화
3. "사용자 인증 정보" → "API 키 만들기"

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/)
2. "API keys" → "Create new secret key"

## 다음 단계

- 📖 [상세 설정 가이드](./SETUP_GUIDE.md)
- 🚀 [Vercel 배포](./SETUP_GUIDE.md#vercel-배포)
- 🎨 UI 커스터마이징

## 문제 해결

**Q: 데이터가 안 보여요**
- API 키 확인
- Google Sheets 공유 설정 확인
- 브라우저 콘솔에서 에러 확인

**Q: AI 인사이트가 작동하지 않아요**
- OpenAI API 키 확인
- API 사용량 한도 확인
- 서버 로그 확인 (`vercel logs`)

**Q: 차트가 비어있어요**
- 데이터 형식 확인
- 년도/월 필터링 확인
- 키워드 선택 확인

---

**더 많은 도움이 필요하신가요?**
→ [SETUP_GUIDE.md](./SETUP_GUIDE.md) 확인
→ GitHub Issues에 문의

**Copyright © FINFLOW**


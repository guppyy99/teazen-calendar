# TEAZEN 혈당 캘린더 - 설정 가이드

## 📋 목차
1. [환경변수 설정](#환경변수-설정)
2. [구글 시트 API 설정](#구글-시트-api-설정)
3. [OpenAI API 설정](#openai-api-설정)
4. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
5. [Vercel 배포](#vercel-배포)

---

## 환경변수 설정

### 1. `.env` 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Google Sheets API (클라이언트 사이드)
VITE_GOOGLE_SHEETS_API_KEY=your_google_api_key_here

# OpenAI API (서버 사이드 전용 - 절대 클라이언트에 노출하지 마세요!)
OPENAI_API_KEY=your_openai_api_key_here

# 애플리케이션 설정
VITE_APP_TITLE=TEAZEN 혈당 캘린더

# 참고: 구글 시트 ID는 코드에 고정되어 있습니다.
# https://docs.google.com/spreadsheets/d/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/
```

---

## 구글 시트 API 설정

### 1. Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "Google Sheets API" 검색 및 활성화

### 2. API 키 생성

1. "API 및 서비스" > "사용자 인증 정보" 이동
2. "사용자 인증 정보 만들기" > "API 키" 선택
3. 생성된 API 키 복사
4. `.env` 파일의 `VITE_GOOGLE_SHEETS_API_KEY`에 붙여넣기

### 3. API 키 제한 설정 (권장)

보안을 위해 API 키에 제한을 설정하세요:

1. 생성한 API 키 클릭
2. "API 제한사항" 섹션에서 "키 제한" 선택
3. "Google Sheets API"만 선택
4. "애플리케이션 제한사항"에서 "HTTP 리퍼러" 선택
5. 허용할 도메인 추가 (예: `*.vercel.app/*`, `localhost:*`)

### 4. 구글 시트 준비

#### 고정된 스프레드시트 사용

⚠️ **중요**: 이 프로젝트는 고정된 구글 시트를 사용합니다.

**시트 URL**: https://docs.google.com/spreadsheets/d/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/

시트 ID는 코드에 하드코딩되어 있으므로 별도로 설정할 필요가 없습니다.
API 키만 발급받으면 됩니다!

#### 데이터 형식

**중요**: 실제 시트 구조는 월별 데이터가 **컬럼**으로 되어 있습니다!

첫 번째 행(헤더):
```
키워드 | 남성(%) | 여성(%) | 연령대별 특성 | 12세 이하(%) | 13~19세(%) | 20~24세(%) | 25~29세(%) | 30~39세(%) | 40~49세(%) | 50세 이상(%) | 2021-11 | 2021-12 | 2022-01 | ...
```

데이터 예시 (2행부터):
```
삼겹살 | 52.5 | 47.5 | 남성 선호 | 3 | 8 | 12 | 18 | 28 | 20 | 11 | 12450 | 13200 | 14800 | ...
치킨 | 48.3 | 51.7 | 균형적 | 8 | 15 | 20 | 18 | 22 | 12 | 5 | 18900 | 19500 | 21200 | ...
```

⚠️ **주의사항**:
- 월 컬럼 형식: `YYYY-M` 또는 `YYYY-MM` (예: 2021-11, 2022-1)
- 각 월 컬럼에는 해당 월의 검색량 입력
- "연령대별 특성" 컬럼은 선택사항 (분석에 사용 안 됨)

📄 자세한 구조는 [GOOGLE_SHEETS_TEMPLATE.md](./GOOGLE_SHEETS_TEMPLATE.md) 참고!

#### 공유 설정

1. 스프레드시트 우측 상단 "공유" 클릭
2. "엑세스 권한 변경" 클릭
3. "링크가 있는 모든 사용자" 선택
4. 권한을 "뷰어"로 설정
5. "완료" 클릭

---

## OpenAI API 설정

### 1. OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com/)에 로그인
2. 우측 상단 프로필 > "API keys" 클릭
3. "Create new secret key" 클릭
4. 키 이름 입력 (예: "TEAZEN Calendar")
5. 생성된 키 복사 (⚠️ 한 번만 표시됩니다!)
6. `.env` 파일의 `OPENAI_API_KEY`에 붙여넣기

### 2. 사용량 한도 설정 (권장)

1. "Usage limits" 메뉴로 이동
2. 월 사용량 한도 설정 (예: $10)
3. 이메일 알림 설정

### 3. 모델 선택

현재 `gpt-4-turbo-preview` 모델을 사용합니다. 비용 절감을 원한다면:

```typescript
// api/generate-insight.ts 파일에서
model: 'gpt-3.5-turbo' // 더 저렴한 옵션
```

---

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드 테스트

```bash
npm run build
npm run preview
```

---

## Vercel 배포

### 1. Vercel 계정 생성 및 프로젝트 연결

1. [Vercel](https://vercel.com/)에 가입/로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 import

### 2. 환경변수 설정

Vercel 대시보드에서:

1. 프로젝트 선택
2. "Settings" > "Environment Variables" 이동
3. 다음 변수 추가:

```
VITE_GOOGLE_SHEETS_API_KEY = your_google_api_key
VITE_GOOGLE_SHEETS_ID = your_spreadsheet_id
OPENAI_API_KEY = your_openai_api_key
VITE_APP_TITLE = TEAZEN 혈당 캘린더
```

⚠️ **중요**: 
- `VITE_` 접두사가 있는 변수만 클라이언트에 노출됩니다
- `OPENAI_API_KEY`는 절대 `VITE_` 접두사를 붙이면 안 됩니다!

### 3. 빌드 설정

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 4. 배포

1. "Deploy" 버튼 클릭
2. 배포 완료 후 제공되는 URL로 접속

### 5. 도메인 설정 (선택사항)

1. "Settings" > "Domains" 이동
2. 커스텀 도메인 추가
3. DNS 설정 안내에 따라 설정

---

## 🔒 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Google Sheets API 키에 HTTP 리퍼러 제한 설정
- [ ] OpenAI API 키가 클라이언트 사이드에 노출되지 않는지 확인
- [ ] 구글 시트가 "뷰어" 권한으로만 공유되어 있는지 확인
- [ ] Vercel 환경변수가 올바르게 설정되었는지 확인

---

## 🐛 트러블슈팅

### Google Sheets API 오류

**문제**: "API key not valid"
**해결**:
1. API 키가 올바른지 확인
2. Google Sheets API가 활성화되어 있는지 확인
3. API 키 제한사항 확인

**문제**: "The caller does not have permission"
**해결**:
1. 스프레드시트가 "링크가 있는 모든 사용자"에게 공유되어 있는지 확인
2. 스프레드시트 ID가 올바른지 확인

### OpenAI API 오류

**문제**: "Incorrect API key provided"
**해결**:
1. API 키가 올바른지 확인
2. 서버 사이드 환경변수로 설정되어 있는지 확인 (`VITE_` 없음)

**문제**: "Rate limit exceeded"
**해결**:
1. OpenAI 대시보드에서 사용량 확인
2. 요청 빈도 줄이기 또는 플랜 업그레이드

### Vercel 배포 오류

**문제**: "Environment variable not found"
**해결**:
1. Vercel 대시보드에서 환경변수 재확인
2. 프로젝트 재배포

---

## 📊 데이터 예시 템플릿

Google Sheets 템플릿을 다운로드하여 사용하세요:

[템플릿 스프레드시트 만들기]

```csv
keyword,year,month,searchVolume,maleRatio,femaleRatio,age10s,age20s,age30s,age40s,age50s,age60plus
삼겹살,2025,1,15000,52.5,47.5,8,25,28,22,12,5
삼겹살,2025,2,16000,53.0,47.0,8,26,27,22,12,5
치킨,2025,1,22000,48.3,51.7,12,30,25,18,10,5
치킨,2025,2,23000,48.5,51.5,12,31,24,18,10,5
쿠팡이츠,2025,1,18000,55.0,45.0,15,35,28,15,5,2
쿠팡이츠,2025,2,19000,55.5,44.5,15,36,27,15,5,2
```

---

## 📞 지원

문제가 해결되지 않으면:
- GitHub Issues에 문의
- FINFLOW 기술 지원팀 연락

**Copyright © FINFLOW. All rights reserved.**


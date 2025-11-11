# 🚀 배포 체크리스트

Vercel에 배포하기 전에 확인하세요!

## ✅ 배포 전 체크리스트

### 1. 환경변수 준비
- [ ] Google Sheets API 키 발급 완료
- [ ] Google Sheets ID 확보
- [ ] OpenAI API 키 발급 완료
- [ ] 모든 API 키가 유효한지 테스트

### 2. Google Sheets 설정
- [ ] 스프레드시트 생성 완료
- [ ] 데이터 입력 완료 (최소 1개월 이상)
- [ ] "링크가 있는 모든 사용자"로 공유 설정
- [ ] 권한이 "뷰어"로 설정됨

### 3. 로컬 테스트
- [ ] `npm install` 실행 완료
- [ ] `.env` 파일 생성 및 설정
- [ ] `npm run dev` 정상 작동 확인
- [ ] 데이터 로드 테스트
- [ ] AI 인사이트 생성 테스트
- [ ] `npm run build` 빌드 성공 확인

### 4. Git 저장소
- [ ] GitHub/GitLab 저장소 생성
- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] 코드 푸시 완료

### 5. Vercel 배포
- [ ] Vercel 계정 생성/로그인
- [ ] 저장소 연결
- [ ] 환경변수 설정 (Vercel 대시보드)
  - [ ] VITE_GOOGLE_SHEETS_API_KEY
  - [ ] VITE_GOOGLE_SHEETS_ID
  - [ ] OPENAI_API_KEY (⚠️ VITE_ 없이!)
- [ ] 배포 성공 확인
- [ ] 프로덕션 URL 접속 테스트

### 6. 배포 후 테스트
- [ ] 메인 페이지 로드 확인
- [ ] 데이터 로드 확인
- [ ] 키워드 선택 및 차트 표시 확인
- [ ] AI 인사이트 생성 확인
- [ ] 모바일 반응형 확인

## 🔧 Vercel 환경변수 설정 방법

1. Vercel 프로젝트 대시보드 접속
2. "Settings" 탭 클릭
3. "Environment Variables" 클릭
4. 각 변수 추가:

```
Name: VITE_GOOGLE_SHEETS_API_KEY
Value: your_google_api_key
Environment: Production, Preview, Development
```

```
Name: VITE_GOOGLE_SHEETS_ID
Value: your_spreadsheet_id
Environment: Production, Preview, Development
```

```
Name: OPENAI_API_KEY
Value: sk-your_openai_key
Environment: Production, Preview, Development
```

5. "Save" 클릭
6. 프로젝트 재배포

## 🛠️ 문제 해결

### 배포 실패 시
1. 빌드 로그 확인
2. 환경변수 오타 확인
3. API 키 유효성 확인

### 데이터 로드 실패 시
1. Google Sheets 공유 설정 확인
2. 스프레드시트 ID 확인
3. API 키 제한사항 확인

### AI 인사이트 실패 시
1. OpenAI API 키 확인
2. API 사용량 한도 확인
3. Vercel Functions 로그 확인

## 📞 지원

문제가 해결되지 않으면:
- SETUP_GUIDE.md 참고
- GitHub Issues 생성
- FINFLOW 기술 지원팀 연락

**Copyright © FINFLOW**


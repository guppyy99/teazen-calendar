# ✅ Vercel 환경변수 체크리스트

## 구글 시트 연결 실패 시 확인사항

### 1. Vercel 대시보드 환경변수 확인

1. **Vercel 대시보드** 접속: https://vercel.com/
2. 프로젝트 선택: `teazen-calendar`
3. **Settings** 탭 클릭
4. 왼쪽 **Environment Variables** 클릭

### 확인할 것:

#### ✅ 변수 1: VITE_GOOGLE_SHEETS_API_KEY
```
Name: VITE_GOOGLE_SHEETS_API_KEY
Value: AIzaSy... (실제 키)
Environment: Production ✓ Preview ✓ Development ✓
```

**주의사항**:
- ❌ `GOOGLE_SHEETS_API_KEY` (VITE_ 없음) - 틀림
- ✅ `VITE_GOOGLE_SHEETS_API_KEY` (VITE_ 있음) - 정확
- 이름 정확히 입력 (대소문자 구분!)
- 값에 따옴표 없이 입력
- 앞뒤 공백 없이

---

## 2. 브라우저 콘솔에서 에러 확인

배포된 사이트 접속 후:

1. **F12** (또는 `Cmd + Option + I`) 눌러서 개발자 도구
2. **Console** 탭 확인

### 확인할 메시지:

```
=== 구글 시트 연결 시도 ===
API 키: AIzaSy...  <--- 이게 "❌ 없음"이면 환경변수 설정 안 된 것!
시트 ID: 11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA
```

#### 경우 1: "API 키: ❌ 없음"
→ **Vercel 환경변수가 안 설정됨**
→ 위 1번 단계 다시 확인

#### 경우 2: "API 키: AIzaSy..." (키는 있음)
→ API 키가 유효하지 않거나 제한 설정 문제

다음 확인:

---

## 3. Google API 키 제한 확인

1. **Google Cloud Console**: https://console.cloud.google.com/
2. **API 및 서비스** → **사용자 인증 정보**
3. API 키 클릭

### 확인사항:

#### API 제한사항
- ✅ "Google Sheets API" 선택되어 있는가?

#### 애플리케이션 제한사항
**옵션 A: 제한 없음** (테스트용)
- "없음" 선택

**옵션 B: HTTP 리퍼러** (프로덕션)
- HTTP 리퍼러 선택
- 추가할 리퍼러:
  ```
  *.vercel.app/*
  *.github.io/*
  localhost:*
  ```

---

## 4. 구글 시트 공유 설정

시트 URL: https://docs.google.com/spreadsheets/d/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/

1. 시트 열기
2. 우측 상단 **"공유"** 클릭
3. **"일반 액세스"** 확인
   - ✅ "링크가 있는 모든 사용자" 
   - ✅ 권한: "뷰어"

---

## 5. API 키 직접 테스트

브라우저에서 이 URL 접속 (API_KEY 교체):

```
https://sheets.googleapis.com/v4/spreadsheets/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/values/Sheet1!A1:L10?key=YOUR_API_KEY
```

**성공**: JSON 데이터가 보임
**실패**: 에러 메시지 확인

### 자주 보는 에러:

#### "API key not valid"
→ API 키가 잘못됨
→ Google Cloud Console에서 키 재확인

#### "The caller does not have permission"
→ 시트 공유 설정 문제
→ "링크가 있는 모든 사용자" 확인

#### "API not enabled"
→ Google Sheets API 활성화 안 됨
→ Google Cloud Console에서 API 활성화

---

## 6. Vercel 환경변수 재설정

만약 환경변수가 있는데도 안 되면:

1. Vercel 대시보드에서 기존 환경변수 **삭제**
2. **새로 추가**:
   ```
   Name: VITE_GOOGLE_SHEETS_API_KEY
   Value: [API 키 복사 붙여넣기]
   Environment: Production, Preview, Development 모두 체크
   ```
3. **"Save"** 클릭
4. **Deployments** 탭 → **"Redeploy"** 클릭

---

## 🚨 빠른 확인

Vercel 배포된 사이트에서:
1. 개발자 도구(F12) → Console
2. 이 명령어 입력:

```javascript
console.log('API Key:', import.meta.env.VITE_GOOGLE_SHEETS_API_KEY)
```

**결과가 `undefined`면**: 환경변수 설정 문제
**결과가 API 키면**: API 키 자체의 문제

---

## 📞 도움

위 단계를 모두 확인했는데도 안 되면:
- Console에 나오는 정확한 에러 메시지 알려주세요
- 어떤 메시지가 보이는지 캡처해주세요

**Copyright © FINFLOW**


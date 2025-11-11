# 🔍 디버깅 가이드

## 구글 시트 데이터 로드 안 될 때

### 1. 브라우저 콘솔 확인

브라우저에서 `F12` 또는 `Cmd+Option+I` (Mac)을 눌러 개발자 도구를 열고 Console 탭을 확인하세요.

### 2. 에러 메시지 확인

#### ❌ "API 키: 없음"
```bash
# .env 파일이 없거나 잘못됨
# 해결: .env 파일 생성 및 API 키 추가
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

#### ❌ "403 Forbidden"
```
# API 키가 유효하지 않거나 시트 접근 권한 없음
# 해결:
1. Google Cloud Console에서 API 키 확인
2. Google Sheets API 활성화 확인
3. 시트 공유 설정 확인 (링크가 있는 모든 사용자)
```

#### ❌ "404 Not Found"
```
# 시트 ID가 잘못됨
# 해결: 코드에 올바른 시트 ID가 하드코딩되어 있는지 확인
# src/services/googleSheets.ts 파일 확인
```

#### ❌ "월별 데이터 컬럼을 찾을 수 없습니다"
```
# 시트 헤더 형식이 잘못됨
# 해결: 헤더 1행에 "2021-11", "2021-12" 형식의 컬럼 있는지 확인
```

### 3. 직접 API 테스트

브라우저에서 다음 URL로 직접 접속해보세요:

```
https://sheets.googleapis.com/v4/spreadsheets/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/values/Sheet1!A1:BZ100?key=YOUR_API_KEY
```

`YOUR_API_KEY`를 실제 API 키로 교체하세요.

**성공하면**: JSON 데이터가 표시됨
**실패하면**: 에러 메시지 확인

### 4. 시트 구조 확인

시트를 열어서 다음을 확인:

```
✓ 시트 이름이 "Sheet1"인가?
✓ 1행에 헤더가 있는가?
✓ "2021-11", "2021-12" 형식의 컬럼이 있는가?
✓ 2행부터 데이터가 있는가?
✓ 공유 설정이 "링크가 있는 모든 사용자"인가?
```

### 5. 환경변수 확인

```bash
# 터미널에서 실행
cd /Users/dynk/.cursor/worktrees/_________/9jawO
cat .env

# VITE_GOOGLE_SHEETS_API_KEY가 있는지 확인
# 값이 비어있지 않은지 확인
```

### 6. 개발 서버 재시작

환경변수를 변경했다면 개발 서버를 재시작하세요:

```bash
# 서버 종료 (Ctrl+C)
# 다시 시작
npm run dev
```

### 7. 네트워크 탭 확인

브라우저 개발자 도구 > Network 탭에서:
- `sheets.googleapis.com` 요청 확인
- 상태 코드 확인 (200이면 성공)
- 응답 내용 확인

### 8. CORS 에러

만약 CORS 에러가 나온다면:
- Google Sheets API는 CORS를 지원하므로 이상함
- API 키 설정 다시 확인
- HTTP 리퍼러 제한 확인

## 실제 데이터 확인 방법

### 개발자 도구 Console에서:

```javascript
// API 키 확인
console.log('API Key:', import.meta.env.VITE_GOOGLE_SHEETS_API_KEY)

// 직접 fetch 테스트
fetch('https://sheets.googleapis.com/v4/spreadsheets/11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA/values/Sheet1!A1:BZ100?key=' + import.meta.env.VITE_GOOGLE_SHEETS_API_KEY)
  .then(r => r.json())
  .then(d => console.log('데이터:', d))
  .catch(e => console.error('에러:', e))
```

## 일반적인 해결 방법

### 문제: "데이터를 불러오는데 실패했습니다"

1. **.env 파일 확인**
   ```bash
   # .env 파일이 존재하는가?
   ls -la .env
   
   # 내용 확인
   cat .env
   ```

2. **API 키 재발급**
   - Google Cloud Console > API 및 서비스 > 사용자 인증 정보
   - 기존 키 삭제하고 새로 생성

3. **시트 공유 확인**
   - 시트 열기
   - "공유" 클릭
   - "링크가 있는 모든 사용자" 확인

4. **브라우저 캐시 삭제**
   - 하드 리프레시: `Cmd+Shift+R` (Mac)

---

**여전히 안 되면**: 
- Console 에러 전체 복사
- 시트 URL 확인
- GitHub Issues에 문의

**Copyright © FINFLOW**


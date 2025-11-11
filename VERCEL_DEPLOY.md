# 🚀 Vercel 배포 가이드

## 방법 1: Vercel 웹사이트에서 배포 (추천)

### 1단계: Vercel 로그인

1. https://vercel.com/ 접속
2. "Sign Up" 또는 "Login" 클릭
3. GitHub 계정으로 로그인

### 2단계: 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." 클릭
2. "Project" 선택
3. GitHub 저장소 검색: `guppyy99/teazen-calendar`
4. "Import" 클릭

### 3단계: 프로젝트 설정

**Framework Preset**: Vite
**Root Directory**: `./` (기본값)
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

모든 설정이 자동으로 감지됩니다! "Deploy" 클릭하면 안 됩니다 (환경변수 먼저 설정)

### 4단계: 환경변수 설정 ⚠️ 중요!

"Environment Variables" 섹션을 펼치고:

#### 첫 번째 변수
```
Name: VITE_GOOGLE_SHEETS_API_KEY
Value: your_google_api_key_here
Environment: Production, Preview, Development (모두 선택)
```

#### 두 번째 변수
```
Name: OPENAI_API_KEY
Value: sk-your_openai_api_key_here
Environment: Production, Preview, Development (모두 선택)
```

⚠️ **주의**: 
- `OPENAI_API_KEY`는 `VITE_` 접두사가 **없어야** 합니다!
- API 키는 따옴표 없이 입력

### 5단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인 (2-3분 소요)
3. 배포 완료!

### 6단계: 확인

배포 완료 후:
1. 제공된 URL 클릭 (예: `https://your-app.vercel.app`)
2. 앱이 정상 작동하는지 확인
3. 브라우저 콘솔(F12)에서 에러 확인

---

## 방법 2: Vercel CLI로 배포

### 사전 준비

```bash
# Vercel CLI 로그인 (브라우저 열림)
vercel login

# 이메일 확인 후 승인
```

### 배포 명령어

```bash
cd /Users/dynk/.cursor/worktrees/_________/9jawO

# 첫 배포 (프로젝트 설정)
vercel

# 프로덕션 배포
vercel --prod
```

### 환경변수 설정 (CLI)

```bash
# API 키 추가
vercel env add VITE_GOOGLE_SHEETS_API_KEY

# OpenAI 키 추가
vercel env add OPENAI_API_KEY

# 환경 선택: Production, Preview, Development (모두 선택)
```

---

## 배포 후 확인 사항

### ✅ 체크리스트

- [ ] 앱이 정상적으로 로드되는가?
- [ ] 구글 시트 데이터가 불러와지는가?
- [ ] 키워드 선택이 작동하는가?
- [ ] 차트가 표시되는가?
- [ ] AI 인사이트가 생성되는가?
- [ ] 모바일에서도 잘 보이는가?

### 🐛 문제 해결

#### 데이터가 안 불러와져요
```bash
# Vercel 환경변수 확인
vercel env ls

# 또는 Vercel 대시보드
Settings > Environment Variables
```

**확인사항**:
- `VITE_GOOGLE_SHEETS_API_KEY`가 있는가?
- 값이 올바른가?

#### AI 인사이트가 안 나와요
```bash
# Vercel Functions 로그 확인
vercel logs

# 또는 대시보드에서
Deployments > 해당 배포 클릭 > Functions 탭
```

**확인사항**:
- `OPENAI_API_KEY`가 설정되었는가?
- API 키가 유효한가?
- API 사용량 한도를 초과하지 않았는가?

#### 404 에러가 나요
- Vercel 설정에서 Framework이 "Vite"로 되어 있는지 확인
- Output Directory가 "dist"인지 확인

---

## 🔄 재배포

코드 변경 후:

```bash
# GitHub에 푸시
git add .
git commit -m "feat: 새 기능 추가"
git push origin main

# Vercel이 자동으로 배포 (GitHub 연동 시)
# 또는 수동:
vercel --prod
```

---

## 🌐 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 > Settings > Domains
2. "Add" 클릭
3. 도메인 입력 (예: teazen.yourdomain.com)
4. DNS 설정 안내에 따라 설정

---

## 📊 환경변수 요약

필요한 환경변수 **2개만**:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_GOOGLE_SHEETS_API_KEY` | Google Sheets API 키 | AIzaSy... |
| `OPENAI_API_KEY` | OpenAI API 키 | sk-proj-... |

**참고**: 구글 시트 ID는 코드에 고정되어 있습니다!

---

## 📞 지원

배포 중 문제가 발생하면:
- [DEBUG_GUIDE.md](./DEBUG_GUIDE.md) 참고
- Vercel 로그 확인
- GitHub Issues에 문의

**Copyright © FINFLOW**


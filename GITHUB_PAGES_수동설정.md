# 🚀 GitHub Pages 배포 - 수동 설정 가이드

## 📌 1단계: GitHub에서 Pages 활성화

### 1-1. 저장소 Settings 접속
1. https://github.com/guppyy99/teazen-calendar 접속
2. 상단 "Settings" 탭 클릭

### 1-2. Pages 설정
1. 왼쪽 메뉴에서 "Pages" 클릭
2. Source: **"GitHub Actions"** 선택
3. 저장 (자동 저장됨)

---

## 📌 2단계: GitHub Actions Workflow 파일 생성

### 2-1. GitHub 웹에서 파일 생성

1. 저장소 메인 페이지로 이동
2. "Add file" → "Create new file" 클릭
3. 파일 이름 입력:
   ```
   .github/workflows/deploy.yml
   ```

### 2-2. 아래 내용 복사해서 붙여넣기

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_GOOGLE_SHEETS_API_KEY: ${{ secrets.VITE_GOOGLE_SHEETS_API_KEY }}
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2-3. 커밋
- Commit message: `feat: GitHub Pages 배포 설정`
- "Commit new file" 클릭

---

## 📌 3단계: GitHub Secrets 설정 (환경변수)

### 3-1. Secrets 페이지 접속
1. 저장소 > "Settings" 탭
2. 왼쪽 메뉴 "Secrets and variables" 펼치기
3. "Actions" 클릭

### 3-2. Google Sheets API 키 추가
1. "New repository secret" 클릭
2. Name: `VITE_GOOGLE_SHEETS_API_KEY`
3. Value: [Google API 키 붙여넣기]
4. "Add secret" 클릭

---

## 📌 4단계: 배포 확인

### 4-1. Actions 탭 확인
1. 저장소 상단 "Actions" 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우 진행 확인
3. 녹색 체크 ✅가 뜨면 성공!

### 4-2. 배포된 사이트 접속
```
https://guppyy99.github.io/teazen-calendar/
```

---

## ⚠️ 중요 참고사항

### OpenAI API는 작동하지 않습니다!
GitHub Pages는 정적 호스팅만 지원하므로, 서버사이드 API(`/api/generate-insight`)가 작동하지 않습니다.

**결과**:
- ✅ 구글 시트 데이터는 정상 작동
- ✅ 차트, 키워드 선택, 모든 UI 작동
- ❌ AI 인사이트는 폴백 메시지만 표시

**완전한 기능을 원한다면**: Vercel 배포 사용 ([VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) 참고)

---

## 🔄 재배포 방법

코드를 수정한 후:

```bash
git add .
git commit -m "feat: 새 기능 추가"
git push origin main
```

→ GitHub Actions가 자동으로 재배포!

---

## 🐛 문제 해결

### "배포가 시작 안 돼요"
- Actions 탭에서 워크플로우 확인
- Settings > Pages에서 Source가 "GitHub Actions"인지 확인

### "403 에러가 나요"
- Settings > Actions > General
- "Workflow permissions"을 "Read and write permissions"로 변경

### "데이터가 안 불러와져요"
- Secrets에 `VITE_GOOGLE_SHEETS_API_KEY`가 있는지 확인
- 시크릿 이름 오타 확인 (대소문자 정확히!)

---

## 📋 체크리스트

배포 전 확인:
- [ ] Settings > Pages > Source를 "GitHub Actions"로 설정
- [ ] `.github/workflows/deploy.yml` 파일 생성
- [ ] Secrets에 `VITE_GOOGLE_SHEETS_API_KEY` 추가
- [ ] main 브랜치에 코드 푸시
- [ ] Actions 탭에서 배포 진행 확인
- [ ] 배포 URL 접속 테스트

---

## 📞 도움말

**배포 URL**: https://guppyy99.github.io/teazen-calendar/

**GitHub 저장소**: https://github.com/guppyy99/teazen-calendar

**Copyright © FINFLOW**


/**
 * 구글 시트 데이터를 JSON으로 변환하는 스크립트
 * 
 * 사용법:
 * 1. 구글 시트를 CSV로 다운로드
 * 2. data.csv로 저장
 * 3. node scripts/convert-sheet-to-json.js 실행
 */

const fs = require('fs')
const path = require('path')

// CSV 파일 읽기
const csvPath = path.join(__dirname, '..', 'data.csv')
const jsonPath = path.join(__dirname, '..', 'public', 'data.json')

if (!fs.existsSync(csvPath)) {
  console.log('❌ data.csv 파일이 없습니다!')
  console.log('📥 구글 시트를 CSV로 다운로드하여 프로젝트 루트에 data.csv로 저장하세요.')
  process.exit(1)
}

const csv = fs.readFileSync(csvPath, 'utf-8')
const lines = csv.split('\n')

if (lines.length < 2) {
  console.log('❌ CSV 파일에 데이터가 없습니다!')
  process.exit(1)
}

// 헤더 파싱
const headers = lines[0].split('\t')
console.log('📊 헤더:', headers.slice(0, 15))

// 월 컬럼 찾기
const monthColumnStartIndex = headers.findIndex(h => /^\d{4}-\d{1,2}$/.test(h.trim()))

if (monthColumnStartIndex === -1) {
  console.log('❌ 월 컬럼을 찾을 수 없습니다!')
  console.log('헤더:', headers)
  process.exit(1)
}

console.log(`✅ 월 컬럼 시작: ${monthColumnStartIndex} (${headers[monthColumnStartIndex]})`)

const result = []

// 각 행 처리
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue
  
  const cells = line.split('\t')
  const keyword = cells[0]
  
  if (!keyword) continue
  
  const maleRatio = parseFloat(cells[1]) || 50
  const femaleRatio = parseFloat(cells[2]) || 50
  const age12Under = parseFloat(cells[4]) || 0
  const age13to19 = parseFloat(cells[5]) || 0
  const age20to24 = parseFloat(cells[6]) || 0
  const age25to29 = parseFloat(cells[7]) || 0
  const age30to39 = parseFloat(cells[8]) || 0
  const age40to49 = parseFloat(cells[9]) || 0
  const age50Plus = parseFloat(cells[10]) || 0
  
  // 월별 데이터 처리
  for (let j = monthColumnStartIndex; j < headers.length; j++) {
    const yearMonth = headers[j].trim()
    const match = yearMonth.match(/^(\d{4})-(\d{1,2})$/)
    
    if (!match) continue
    
    const year = parseInt(match[1])
    const month = parseInt(match[2])
    const searchVolume = parseFloat(cells[j]) || 0
    
    if (searchVolume > 0) {
      result.push({
        keyword,
        year,
        month,
        searchVolume,
        maleRatio,
        femaleRatio,
        ageDistribution: {
          '12세 이하': age12Under,
          '13~19세': age13to19,
          '20~24세': age20to24,
          '25~29세': age25to29,
          '30~39세': age30to39,
          '40~49세': age40to49,
          '50세 이상': age50Plus,
        }
      })
    }
  }
}

// JSON 저장
fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2))

console.log(`\n✅ 완료! ${result.length}개 데이터를 public/data.json에 저장했습니다.`)
console.log(`📦 파일 크기: ${(fs.statSync(jsonPath).size / 1024).toFixed(2)} KB`)


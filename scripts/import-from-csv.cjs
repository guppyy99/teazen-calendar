const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('❌ 사용법: node scripts/import-from-csv.js <csv파일경로>')
  process.exit(1)
}

if (!fs.existsSync(inputPath)) {
  console.error(`❌ 파일을 찾을 수 없습니다: ${inputPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(inputPath, 'utf-8')
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n')

const lines = raw.split('\n').filter(Boolean)
if (lines.length < 2) {
  console.error('❌ CSV 파일에 데이터가 없습니다.')
  process.exit(1)
}

const headers = lines[0].split(',').map(h => h.trim())
const monthColumnStartIndex = headers.findIndex(h => /^\d{4}-\d{1,2}$/.test(h))

if (monthColumnStartIndex === -1) {
  console.error('❌ 월 컬럼을 찾을 수 없습니다!')
  console.error(headers)
  process.exit(1)
}

const result = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  if (!line) continue
  const cells = line.split(',')
  const keyword = cells[0]?.trim()
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

  for (let j = monthColumnStartIndex; j < headers.length; j++) {
    const header = headers[j]
    if (!header) continue
    const match = header.match(/^(\d{4})-(\d{1,2})$/)
    if (!match) continue

    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const value = parseFloat(cells[j]) || 0

    if (value > 0) {
      result.push({
        keyword,
        year,
        month,
        searchVolume: value,
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

const outputPath = path.join(__dirname, '..', 'public', 'data.json')
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')
console.log(`✅ ${result.length}개 데이터를 ${outputPath}에 저장했습니다.`)

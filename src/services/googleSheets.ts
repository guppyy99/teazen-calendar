import axios from 'axios'
import type { KeywordData } from '../types'

const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
// 구글 시트 ID 고정
const SPREADSHEET_ID = '11suzDWw5CjAnLxiwVHbdn-xUkttdtUMmoxDMZvxqkiA'

/**
 * 구글 시트에서 데이터 가져오기
 * 
 * 실제 시트 구조:
 * 헤더(1행): 키워드 | 남성(%) | 여성(%) | 연령대별 특성 | 12세 이하(%) | 13~19세(%) | ... | 2021-11 | 2021-12 | ...
 * 데이터(2행~): 삼겹살 | 52.5 | 47.5 | ... | 8 | 15 | ... | 1234 | 5678 | ...
 */
export async function fetchKeywordDataFromSheet(): Promise<KeywordData[]> {
  // 디버깅 정보 출력
  console.log('=== 구글 시트 연결 시도 ===')
  console.log('API 키:', GOOGLE_SHEETS_API_KEY ? `${GOOGLE_SHEETS_API_KEY.substring(0, 10)}...` : '❌ 없음')
  console.log('시트 ID:', SPREADSHEET_ID)
  
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error('❌ VITE_GOOGLE_SHEETS_API_KEY 환경변수가 설정되지 않았습니다!\n\n.env 파일을 확인하세요.')
  }
  
  try {
    // 여러 시트 이름 시도
    const possibleSheetNames = ['Sheet1', '시트1', 'Sheet', '데이터', 'Data']
    let rows: any[] = []
    let headers: string[] = []
    let usedSheetName = ''
    
    for (const sheetName of possibleSheetNames) {
      try {
        const range = `${sheetName}!A1:BZ1000`
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`
        
        console.log(`시도 중: ${sheetName}`)
        
        const response = await axios.get(url)
        rows = response.data.values || []
        
        if (rows.length >= 2) {
          headers = rows[0]
          usedSheetName = sheetName
          console.log(`✅ ${sheetName} 시트에서 데이터 발견!`)
          console.log('응답 받음:', rows.length, '행')
          console.log('헤더 개수:', headers.length)
          console.log('첫 10개 헤더:', headers.slice(0, 10))
          break
        }
      } catch (sheetError: any) {
        console.log(`${sheetName} 시트 없음, 다음 시도...`)
        continue
      }
    }
    
    if (rows.length === 0) {
      throw new Error('모든 시트 이름을 시도했지만 데이터를 찾을 수 없습니다.')
    }

    // headers는 위에서 이미 설정됨
    
    // 월별 데이터 컬럼 찾기 (2021-11 형식)
    const monthColumnStartIndex = headers.findIndex((h: string) => /^\d{4}-\d{1,2}$/.test(h))
    
    if (monthColumnStartIndex === -1) {
      console.error('❌ 월별 컬럼을 찾을 수 없습니다!')
      console.error('전체 헤더:', headers)
      console.error('YYYY-M 또는 YYYY-MM 형식의 헤더가 필요합니다 (예: 2021-11, 2022-1)')
      throw new Error(`월별 데이터 컬럼을 찾을 수 없습니다.\n\n시트 헤더: ${headers.slice(0, 20).join(', ')}...\n\n2021-11 같은 형식이 필요합니다.`)
    }
    
    console.log(`✅ 월별 데이터 시작 컬럼: ${monthColumnStartIndex} (${headers[monthColumnStartIndex]})`)

    const result: KeywordData[] = []

    // 각 행 처리 (2행부터)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      
      if (!row || !row[0]) continue // 키워드가 없으면 스킵

      const keyword = row[0]
      const maleRatio = parseFloat(row[1]) || 50
      const femaleRatio = parseFloat(row[2]) || 50
      // row[3]은 "연령대별 특성" (사용 안 함)
      const age12Under = parseFloat(row[4]) || 0
      const age13to19 = parseFloat(row[5]) || 0
      const age20to24 = parseFloat(row[6]) || 0
      const age25to29 = parseFloat(row[7]) || 0
      const age30to39 = parseFloat(row[8]) || 0
      const age40to49 = parseFloat(row[9]) || 0
      const age50Plus = parseFloat(row[10]) || 0

      // 월별 데이터 처리
      for (let j = monthColumnStartIndex; j < headers.length; j++) {
        const yearMonth = headers[j] as string
        const match = yearMonth.match(/^(\d{4})-(\d{1,2})$/)
        
        if (!match) continue

        const year = parseInt(match[1])
        const month = parseInt(match[2])
        const searchVolume = parseFloat(row[j]) || 0

        // searchVolume이 0이 아닌 경우만 추가
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

    console.log(`✅ 구글 시트에서 ${result.length}개 데이터 로드 완료`)
    return result

  } catch (error: any) {
    console.error('❌ 구글 시트 데이터 로드 실패:', error)
    console.error('API 키:', GOOGLE_SHEETS_API_KEY ? '설정됨' : '❌ 없음')
    console.error('시트 ID:', SPREADSHEET_ID)
    console.error('에러 상세:', error.response?.data || error.message)
    throw new Error(`구글 시트 연결 실패: ${error.message}`)
  }
}

// 더미 데이터 삭제됨 - 실제 구글 시트 데이터만 사용

/**
 * 특정 년도/월의 데이터 필터링
 */
export function filterDataByYearMonth(
  data: KeywordData[],
  year: number,
  month?: number
): KeywordData[] {
  return data.filter(item => {
    if (month) {
      return item.year === year && item.month === month
    }
    return item.year === year
  })
}

/**
 * 검색량 순으로 키워드 정렬
 */
export function sortKeywordsByVolume(data: KeywordData[]): string[] {
  const volumeMap = new Map<string, number>()
  
  data.forEach(item => {
    const current = volumeMap.get(item.keyword) || 0
    volumeMap.set(item.keyword, current + item.searchVolume)
  })

  return Array.from(volumeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
}

/**
 * 키워드별 데이터 집계
 */
export function aggregateKeywordData(
  data: KeywordData[],
  keyword: string,
  year: number
): KeywordData[] {
  return data.filter(item => 
    item.keyword === keyword && item.year === year
  ).sort((a, b) => a.month - b.month)
}


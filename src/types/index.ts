// 키워드 데이터 타입
export interface KeywordData {
  keyword: string
  year: number
  month: number
  searchVolume: number
  maleRatio: number
  femaleRatio: number
  ageDistribution: AgeDistribution
}

// 연령대 분포
export interface AgeDistribution {
  '12세 이하': number
  '13~19세': number
  '20~24세': number
  '25~29세': number
  '30~39세': number
  '40~49세': number
  '50세 이상': number
}

// 구글 시트 행 데이터 (실제 구조)
// 헤더: 키워드 | 남성(%) | 여성(%) | 연령대별 특성 | 12세 이하(%) | ... | 2021-11 | 2021-12 | ...
export interface SheetRow {
  keyword: string
  maleRatio: string
  femaleRatio: string
  ageCharacteristics: string
  age12Under: string
  age13to19: string
  age20to24: string
  age25to29: string
  age30to39: string
  age40to49: string
  age50Plus: string
  monthlyData: { [yearMonth: string]: string } // '2021-11': '1234', '2021-12': '5678', ...
}

// AI 인사이트 응답
export interface AIInsightResponse {
  insight: string
  summary: string
}

// 차트 데이터 포인트
export interface ChartDataPoint {
  label: string
  [keyword: string]: number | string
}


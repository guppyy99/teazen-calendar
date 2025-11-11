import { useState, useEffect } from 'react'
import type { KeywordData } from '../types'
import { 
  fetchKeywordDataFromSheet, 
  filterDataByYearMonth,
  sortKeywordsByVolume 
} from '../services/googleSheets'

export function useKeywordData(year: number, month?: number) {
  const [allData, setAllData] = useState<KeywordData[]>([])
  const [filteredData, setFilteredData] = useState<KeywordData[]>([])
  const [sortedKeywords, setSortedKeywords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    loadData()
  }, [])

  // 년도/월 변경 시 필터링
  useEffect(() => {
    if (allData.length > 0) {
      const filtered = filterDataByYearMonth(allData, year, month)
      setFilteredData(filtered)
      
      // 검색량 순으로 키워드 정렬
      const sorted = sortKeywordsByVolume(filtered)
      setSortedKeywords(sorted)
    }
  }, [allData, year, month])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchKeywordDataFromSheet()
      setAllData(data)
      setError(null)
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    await loadData()
  }

  return {
    allData,
    filteredData,
    sortedKeywords,
    isLoading,
    error,
    refreshData
  }
}


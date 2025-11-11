import { useState, useEffect } from 'react'
import type { KeywordData } from '../types'
import { generateAIInsight } from '../services/openai'
import './AIInsight.css'

interface AIInsightProps {
  selectedMonth: number
  selectedYear: number
  selectedKeywords: string[]
  keywordData: KeywordData[]
}

function AIInsight({ selectedMonth, selectedYear, selectedKeywords, keywordData }: AIInsightProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [insight, setInsight] = useState('')

  useEffect(() => {
    generateInsight()
  }, [selectedMonth, selectedKeywords, keywordData])

  const generateInsight = async () => {
    setIsLoading(true)
    setIsExpanded(false)

    try {
      // 선택된 키워드의 데이터만 필터링
      const relevantData = keywordData.filter(item => 
        selectedKeywords.includes(item.keyword)
      )

      // AI 인사이트 생성
      const result = await generateAIInsight(selectedKeywords, selectedMonth, relevantData)
      setInsight(result.insight)
    } catch (error) {
      console.error('인사이트 생성 실패:', error)
      // 폴백 메시지
      setInsight(getFallbackInsight())
    }

    // 로딩 완료
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // 펼치기 애니메이션
    setTimeout(() => {
      setIsExpanded(true)
    }, 1100)
  }

  const getFallbackInsight = () => {
    if (selectedKeywords.length === 0) {
      return '키워드를 선택하면 AI가 검색 트렌드를 분석하여 인사이트를 제공합니다.'
    }

    const keywordText = selectedKeywords.map(k => `'${k}'`).join(', ')
    const totalVolume = keywordData
      .filter(item => selectedKeywords.includes(item.keyword))
      .reduce((sum, item) => sum + item.searchVolume, 0)

    return `${selectedMonth}월 ${keywordText} 키워드의 총 검색량은 ${totalVolume.toLocaleString()}회입니다. 해당 키워드들의 검색 트렌드를 분석하여 마케팅 전략에 활용하세요.`
  }

  return (
    <div className="ai-insight-section">
      <h3 className="ai-insight-title">AI 인사이트</h3>
      <div className={`ai-insight-card ${isLoading ? 'loading' : ''} ${isExpanded ? 'expanded' : ''}`}>
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span className="loading-text">AI 분석 중...</span>
          </div>
        ) : (
          <div className="insight-content-wrapper">
            <div className="insight-icon">✨</div>
            <div className="insight-text-box">
              {selectedKeywords.length > 0 && (
                <div className="insight-labels">
                  {selectedKeywords.map((keyword, index) => (
                    <span key={keyword} className="insight-label" data-index={index}>
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <p className="insight-text">{insight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIInsight


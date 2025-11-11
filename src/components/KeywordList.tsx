import { useState } from 'react'
import type { KeywordData } from '../types'
import AgeDistributionChart from './AgeDistributionChart'
import './KeywordList.css'

interface KeywordListProps {
  selectedKeywords: string[]
  toggleKeyword: (keyword: string) => void
  sortedKeywords: string[]
  keywordData: KeywordData[]
  isLoading: boolean
}

const KEYWORD_COLORS = [
  '#8b7aff', // 보라
  '#ff6b9d', // 핑크
  '#4ecdc4', // 청록
  '#ffa502', // 주황
  '#ff6348', // 빨강
  '#a29bfe', // 연보라
  '#fd79a8', // 연핑크
  '#00b894', // 녹청
  '#6c5ce7', // 인디고
  '#e17055', // 테라코타
  '#fdcb6e', // 노랑
  '#00cec9', // 시안
  '#0984e3', // 블루
  '#d63031', // 다크레드
  '#e84393', // 마젠타
  '#74b9ff', // 라이트블루
]

function KeywordList({ 
  selectedKeywords, 
  toggleKeyword, 
  sortedKeywords, 
  keywordData,
  isLoading 
}: KeywordListProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const getKeywordColor = (keyword: string) => {
    const index = sortedKeywords.indexOf(keyword)
    return KEYWORD_COLORS[index % KEYWORD_COLORS.length]
  }

  const isSelected = (keyword: string) => selectedKeywords.includes(keyword)

  // 검색 필터링
  const filteredKeywords = sortedKeywords.filter(keyword =>
    keyword.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 호버된 키워드의 연령대 데이터 가져오기
  const getAgeDistribution = (keyword: string) => {
    const data = keywordData.find(item => item.keyword === keyword)
    return data?.ageDistribution
  }

  // 검색량 가져오기
  const getSearchVolume = (keyword: string) => {
    const data = keywordData.filter(item => item.keyword === keyword)
    const total = data.reduce((sum, item) => sum + item.searchVolume, 0)
    return total
  }

  if (isLoading) {
    return (
      <div className="keyword-section">
        <h3 className="keyword-title">Keyword</h3>
        <div className="keyword-loading">데이터 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="keyword-section">
      <h3 className="keyword-title">Keyword</h3>
      
      <div className="keyword-search">
        <input
          type="text"
          placeholder="키워드 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="keyword-search-input"
        />
      </div>

      <div className="keyword-list-container">
        <div className="keyword-list">
          {filteredKeywords.map((keyword) => {
            const ageData = getAgeDistribution(keyword)
            const volume = getSearchVolume(keyword)
            
            return (
              <div
                key={keyword}
                className="keyword-item-wrapper"
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
              >
                <button
                  className={`keyword-btn ${isSelected(keyword) ? 'active' : ''}`}
                  style={{
                    backgroundColor: isSelected(keyword) ? getKeywordColor(keyword) : '#f5f5f5',
                    color: isSelected(keyword) ? 'white' : '#666',
                  }}
                  onClick={() => toggleKeyword(keyword)}
                >
                  <span className="keyword-name">{keyword}</span>
                  <span className="keyword-volume">
                    {volume.toLocaleString()}
                  </span>
                </button>
                
                {hoveredKeyword === keyword && ageData && (
                  <AgeDistributionChart data={ageData} keyword={keyword} />
                )}
              </div>
            )
          })}
          
          {filteredKeywords.length === 0 && (
            <div className="keyword-empty">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="keyword-stats">
        총 {sortedKeywords.length}개 키워드
        {selectedKeywords.length > 0 && ` · ${selectedKeywords.length}개 선택됨`}
      </div>
    </div>
  )
}

export default KeywordList
export { KEYWORD_COLORS }


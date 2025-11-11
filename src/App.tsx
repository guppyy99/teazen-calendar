import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Calendar from './components/Calendar'
import AIInsight from './components/AIInsight'
import KeywordList from './components/KeywordList'
import TrendChart from './components/TrendChart'
import Footer from './components/Footer'
import { useKeywordData } from './hooks/useKeywordData'

function App() {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(3)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('6달')

  // 실제 데이터 로드
  const { 
    filteredData, 
    sortedKeywords, 
    isLoading, 
    error,
    refreshData 
  } = useKeywordData(selectedYear, selectedMonth)

  // 자동으로 첫 번째 키워드 선택 (데이터 로드 후)
  useState(() => {
    if (!isLoading && sortedKeywords.length > 0 && selectedKeywords.length === 0) {
      setSelectedKeywords([sortedKeywords[0]])
    }
  })

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleUpdate = () => {
    refreshData()
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <div className="error-message">
            <h3>오류가 발생했습니다</h3>
            <p>{error}</p>
            <button onClick={refreshData}>다시 시도</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="container">
        <Calendar 
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          onUpdate={handleUpdate}
        />
        <AIInsight 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear}
          selectedKeywords={selectedKeywords}
          keywordData={filteredData}
        />
        <div className="content-wrapper">
          <KeywordList 
            selectedKeywords={selectedKeywords}
            toggleKeyword={toggleKeyword}
            sortedKeywords={sortedKeywords}
            keywordData={filteredData}
            isLoading={isLoading}
          />
          <TrendChart 
            selectedKeywords={selectedKeywords} 
            selectedYear={selectedYear}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            keywordData={filteredData}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App


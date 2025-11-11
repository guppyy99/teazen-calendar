import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import type { KeywordData } from '../types'
import ChartTooltip from './ChartTooltip'
import './TrendChart.css'
import { KEYWORD_COLORS } from './KeywordList'

interface TrendChartProps {
  selectedKeywords: string[]
  selectedYear: number
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
  keywordData: KeywordData[]
}

function TrendChart({ selectedKeywords, selectedYear, selectedPeriod, setSelectedPeriod, keywordData }: TrendChartProps) {
  const periods = ['3개월', '6개월', '1년', '2년']
  
  // 기간에 따른 차트 데이터 생성
  const chartData = useMemo(() => {
    let dataPoints: any[] = []
    const currentDate = new Date()
    
    switch(selectedPeriod) {
      case '3개월': {
        // 최근 3개월 데이터
        for (let i = 2; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          
          const point: any = { label: `${year}.${month}` }
          selectedKeywords.forEach(keyword => {
            const monthData = keywordData.find(
              item => item.keyword === keyword && item.year === year && item.month === month
            )
            point[keyword] = monthData?.searchVolume || 0
          })
          dataPoints.push(point)
        }
        break
      }
      case '6개월': {
        // 최근 6개월 데이터
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          
          const point: any = { label: `${year}.${month}` }
          selectedKeywords.forEach(keyword => {
            const monthData = keywordData.find(
              item => item.keyword === keyword && item.year === year && item.month === month
            )
            point[keyword] = monthData?.searchVolume || 0
          })
          dataPoints.push(point)
        }
        break
      }
      case '1년': {
        // 최근 12개월 데이터
        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          
          const point: any = { label: `${year}.${month}` }
          selectedKeywords.forEach(keyword => {
            const monthData = keywordData.find(
              item => item.keyword === keyword && item.year === year && item.month === month
            )
            point[keyword] = monthData?.searchVolume || 0
          })
          dataPoints.push(point)
        }
        break
      }
      case '2년': {
        // 최근 24개월 데이터 (분기별로 표시)
        for (let i = 7; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1)
          const year = date.getFullYear()
          const quarter = Math.floor(date.getMonth() / 3) + 1
          
          const point: any = { label: `${year}Q${quarter}` }
          
          // 해당 분기의 3개월 데이터 합산
          selectedKeywords.forEach(keyword => {
            let total = 0
            for (let m = 0; m < 3; m++) {
              const qDate = new Date(year, (quarter - 1) * 3 + m, 1)
              const qYear = qDate.getFullYear()
              const qMonth = qDate.getMonth() + 1
              
              const monthData = keywordData.find(
                item => item.keyword === keyword && item.year === qYear && item.month === qMonth
              )
              total += monthData?.searchVolume || 0
            }
            point[keyword] = total
          })
          dataPoints.push(point)
        }
        break
      }
      default:
        // 기본값: 6개월
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          
          const point: any = { label: `${year}.${month}` }
          selectedKeywords.forEach(keyword => {
            const monthData = keywordData.find(
              item => item.keyword === keyword && item.year === year && item.month === month
            )
            point[keyword] = monthData?.searchVolume || 0
          })
          dataPoints.push(point)
        }
    }
    
    return dataPoints
  }, [selectedKeywords, keywordData, selectedPeriod])

  // 남녀 비율 계산
  const genderRatio = useMemo(() => {
    const relevantData = keywordData.filter(item =>
      selectedKeywords.includes(item.keyword)
    )

    if (relevantData.length === 0) {
      return { male: 50, female: 50 }
    }

    const totalMale = relevantData.reduce((sum, item) => sum + item.maleRatio * item.searchVolume, 0)
    const totalFemale = relevantData.reduce((sum, item) => sum + item.femaleRatio * item.searchVolume, 0)
    const totalVolume = relevantData.reduce((sum, item) => sum + item.searchVolume, 0)

    return {
      male: totalVolume > 0 ? (totalMale / totalVolume) : 50,
      female: totalVolume > 0 ? (totalFemale / totalVolume) : 50
    }
  }, [selectedKeywords, keywordData])

  // Y축 최대값 계산 (데이터 기반)
  const maxValue = useMemo(() => {
    const values = chartData.flatMap(point =>
      selectedKeywords.map(keyword => point[keyword] || 0)
    )
    const max = Math.max(...values, 100)
    return Math.ceil(max / 1000) * 1000 // 1000 단위로 올림
  }, [chartData, selectedKeywords])

  const getKeywordColor = (keyword: string) => {
    const allKeywords = [...new Set(keywordData.map(item => item.keyword))]
    const index = allKeywords.indexOf(keyword)
    return KEYWORD_COLORS[index % KEYWORD_COLORS.length]
  }

  // 차트 툴팁용 연령대 데이터
  const ageDataMap = useMemo(() => {
    const map: { [keyword: string]: any } = {}
    selectedKeywords.forEach(keyword => {
      const data = keywordData.find(item => item.keyword === keyword)
      if (data) {
        map[keyword] = data.ageDistribution
      }
    })
    return map
  }, [selectedKeywords, keywordData])

  return (
    <div className="chart-section">
      <div className="chart-header">
        <div className="chart-title-wrapper">
          {selectedKeywords.length > 0 ? (
            <>
              {selectedKeywords.slice(0, 3).map((keyword, index) => (
                <span key={keyword}>
                  <span className="chart-keyword" style={{ color: getKeywordColor(keyword) }}>
                    '{keyword}'
                  </span>
                  {index < Math.min(selectedKeywords.length - 1, 2) && <span className="chart-separator">, </span>}
                </span>
              ))}
              {selectedKeywords.length > 3 && (
                <span className="keyword-overflow">
                  <span className="chart-separator">, </span>
                  <span className="chart-keyword more">...</span>
                  <div className="keyword-overflow-box">
                    {selectedKeywords.slice(3).map((keyword) => (
                      <div key={keyword} className="overflow-item" style={{ color: getKeywordColor(keyword) }}>
                        {keyword}
                      </div>
                    ))}
                  </div>
                </span>
              )}
            </>
          ) : (
            <span className="chart-keyword">키워드를 선택하세요</span>
          )}
          <span className="chart-subtitle">검색량 추이</span>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color male"></span>
            <span className="legend-label">남성</span>
            <span className="legend-value">{genderRatio.male.toFixed(2)}%</span>
          </div>
          <div className="legend-item">
            <span className="legend-color female"></span>
            <span className="legend-label">여성</span>
            <span className="legend-value">{genderRatio.female.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="period-selector">
        {periods.map((period) => (
          <button
            key={period}
            className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              {selectedKeywords.map((keyword) => (
                <linearGradient key={keyword} id={`color${keyword}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getKeywordColor(keyword)} stopOpacity={0.4}/>
                  <stop offset="50%" stopColor={getKeywordColor(keyword)} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={getKeywordColor(keyword)} stopOpacity={0.05}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#f3f3f3" vertical={false} />
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#aaa', fontSize: 13 }}
              dy={12}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#aaa', fontSize: 13 }}
              dx={-5}
              domain={[0, maxValue]}
            />
            <ChartTooltip ageData={ageDataMap} />
            {selectedKeywords.map((keyword) => (
              <Area
                key={keyword}
                type="monotone"
                dataKey={keyword}
                stroke={getKeywordColor(keyword)}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#color${keyword})`}
                dot={{ r: 4, fill: getKeywordColor(keyword), strokeWidth: 0 }}
                activeDot={{ r: 6, fill: getKeywordColor(keyword), strokeWidth: 3, stroke: 'white' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendChart


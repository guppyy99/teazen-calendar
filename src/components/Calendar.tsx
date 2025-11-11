import { useState } from 'react'
import './Calendar.css'

interface CalendarProps {
  selectedYear: number
  setSelectedYear: (year: number) => void
  selectedMonth: number
  setSelectedMonth: (month: number) => void
  onUpdate?: () => void
}

function Calendar({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, onUpdate }: CalendarProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  const months = [
    { label: '1월', value: 1 },
    { label: '2월', value: 2 },
    { label: '3월', value: 3 },
    { label: '4월', value: 4 },
    { label: '5월', value: 5 },
    { label: '6월', value: 6 },
    { label: '7월', value: 7 },
    { label: '8월', value: 8 },
    { label: '9월', value: 9 },
    { label: '10월', value: 10 },
    { label: '11월', value: 11 },
    { label: '12월', value: 12 },
  ]

  const getLastUpdateDateTime = () => {
    const year = lastUpdate.getFullYear()
    const month = String(lastUpdate.getMonth() + 1).padStart(2, '0')
    const day = String(lastUpdate.getDate()).padStart(2, '0')
    const hours = lastUpdate.getHours()
    const minutes = String(lastUpdate.getMinutes()).padStart(2, '0')
    const period = hours < 12 ? '오전' : '오후'
    const displayHours = hours % 12 || 12
    
    return `${year}-${month}-${day} ${period} ${displayHours}:${minutes}`
  }

  const handleUpdate = () => {
    setLastUpdate(new Date())
    onUpdate?.()
  }

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <h2 className="calendar-title">Calander</h2>
        <div className="calendar-update-info">
          <span className="calendar-datetime">최종 업데이트 확인 데이터: {getLastUpdateDateTime()}</span>
          <button className="update-btn" onClick={handleUpdate}>업데이트</button>
        </div>
      </div>
      
      <div className="year-month-selector">
        <button 
          className="year-nav"
          onClick={() => setSelectedYear(selectedYear - 1)}
        >
          &lt;
        </button>
        <span className="year-display">{selectedYear}</span>
        <button 
          className="year-nav"
          onClick={() => setSelectedYear(selectedYear + 1)}
        >
          &gt;
        </button>
        
        {months.map((month) => (
          <button
            key={month.value}
            className={`month-btn ${selectedMonth === month.value ? 'active' : ''}`}
            onClick={() => setSelectedMonth(month.value)}
          >
            {month.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calendar


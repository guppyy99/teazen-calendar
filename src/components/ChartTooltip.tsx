import { TooltipProps } from 'recharts'
import type { AgeDistribution } from '../types'
import './ChartTooltip.css'

interface CustomTooltipProps extends TooltipProps<number, string> {
  ageData?: { [keyword: string]: AgeDistribution }
}

function ChartTooltip({ active, payload, label, ageData }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="custom-chart-tooltip">
      <div className="tooltip-header">{label}</div>
      <div className="tooltip-content">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <div className="tooltip-keyword">
              <span 
                className="tooltip-color-dot" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="tooltip-name">{entry.name}</span>
              <span className="tooltip-value">{entry.value?.toLocaleString()}</span>
            </div>
            {ageData && ageData[entry.name as string] && (
              <div className="tooltip-age-distribution">
                <div className="age-title">연령대 분포</div>
                <div className="age-bars">
                  {Object.entries(ageData[entry.name as string]).map(([age, percent]) => (
                    <div key={age} className="age-bar-item">
                      <span className="age-label">{age}</span>
                      <div className="age-bar-container">
                        <div 
                          className="age-bar-fill" 
                          style={{ 
                            width: `${percent}%`,
                            backgroundColor: entry.color 
                          }}
                        />
                      </div>
                      <span className="age-percent">{percent.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartTooltip


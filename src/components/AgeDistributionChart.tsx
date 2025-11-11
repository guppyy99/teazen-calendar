import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import type { AgeDistribution } from '../types'
import './AgeDistributionChart.css'

interface AgeDistributionChartProps {
  data: AgeDistribution
  keyword: string
}

function AgeDistributionChart({ data, keyword }: AgeDistributionChartProps) {
  const chartData = Object.entries(data).map(([age, value]) => ({
    age,
    value: Math.round(value)
  }))

  return (
    <div className="age-chart-popup">
      <h4 className="age-chart-title">{keyword} - 연령대 분포</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => [`${value}%`, '비율']}
          />
          <Bar dataKey="value" fill="#8b7aff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AgeDistributionChart


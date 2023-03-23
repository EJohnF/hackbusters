import React from 'react'
import ChartComparison from './chart-comparison'
import ChartExtremum from './chart-extremum'

const Chart: React.FC = () => {
  return (
    <div style={{ position: 'relative', marginBottom: '20px', width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '50%' }}>
        <ChartComparison />
      </div>
      <div style={{ width: '50%' }}>
        <ChartExtremum />
      </div>
    </div>
  )
}

export default Chart

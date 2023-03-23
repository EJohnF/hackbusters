import React, { ReactPropTypes, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import * as Utils from '../../lib/chartUtils'
import Chart1 from 'chart.js/auto'
import { CategoryScale } from 'chart.js'

const DATA_COUNT = 4
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 1 }

const labels = [1, 2, 3, 4, 5, 6, 7].filter((v) => v > 0)

const data = {
    labels: labels,
    // cubicInterpolationMode: 'monotone',
    // tension: 0.4,
    datasets: [
        {
            label: 'Carbon weighted score',
            data: Utils.numbers(NUMBER_CFG),
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            yAxisID: 'y',
            cubicInterpolationMode: 'monotone' as const,
            tension: 0.4
        }
    ]
}

const Chart: React.FC = () => {
    Chart1.register(CategoryScale)

    useEffect(() => {}, [])

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Extremum'
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Submissions'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Acc/C02'
                }
            }
        }
    }

    return <Line data={data} options={options} width={40} height={400} />
}

export default Chart

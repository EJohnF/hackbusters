import React, { ReactPropTypes, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import * as Utils from '../../lib/chartUtils'
import Chart1 from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { useSubmissions } from "../../data/data-context";

const labels = [1, 2, 3, 4]

const Chart: React.FC = () => {
    Chart1.register(CategoryScale)
    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: 'Accuracy',
                data: [] as number[],
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
                yAxisID: 'y',
                cubicInterpolationMode: 'monotone' as const,
                tension: 0.4
            },
            {
                label: 'Emission (kg)',
                data: [] as number[],
                borderColor: Utils.CHART_COLORS.blue,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
                yAxisID: 'y1',
                cubicInterpolationMode: 'monotone' as const,
                tension: 0.4
            }
        ]
    })
    const submissions = useSubmissions();
    useEffect(() => {
        const submissionsSorted = submissions.sort((a, b) => b.accuracy - a.accuracy);
        let dataY: number[] = [], dataY1: number[] = [];
        submissionsSorted.forEach(v => {
            dataY.push(+v.accuracy);
            dataY1.push(+v.emissions);
        });
        setData({
            ...data,
            labels: Array(submissions.length).fill(1).map((_, k) => k + 1),
            datasets: [
                {
                    ...data.datasets[0],
                    data: [...dataY]
                },
                {
                    ...data.datasets[1],
                    data: [...dataY1]
                }
            ]
        })
    }, [submissions])


    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Carbon'
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Leaderboard position'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Accuracy'
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false
                },
                title: {
                    display: true,
                    text: 'CO2'
                }
            }
        }
    }

    return <Line data={data} options={options} width={40} height={400} />
}

export default Chart

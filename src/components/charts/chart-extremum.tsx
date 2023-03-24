import React, { ReactPropTypes, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import * as Utils from '../../lib/chartUtils'
import Chart1 from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { useSubmissions } from "../../data/data-context";

const DATA_COUNT = 4
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 1 }

const labels = [1, 2, 3, 4]

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

    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: 'Carbon weighted score',
                data: [] as number[],
                borderColor: Utils.CHART_COLORS.red,
                backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
                yAxisID: 'y',
                cubicInterpolationMode: 'monotone' as const,
                tension: 0.4
            }
        ]
    })

    const submissions = useSubmissions();
    useEffect(() => {
        console.log('submissions', submissions)
        const submissionsSorted = submissions.sort((a, b) => b.score - a.score);
        let dataY: number[] = [];
        [...submissionsSorted].sort((a, b) => b.accuracy - a.accuracy).forEach(v => {
            dataY.push((v.score) /*/ v.emissions*/);
        });
        setData({
            ...data,
            labels: Array(submissions.length).fill(1).map((_, k) => k + 1),
            datasets: [
                {
                    ...data.datasets[0],
                    data: [...dataY]
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

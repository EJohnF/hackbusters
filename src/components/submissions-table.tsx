import {Table, Typography} from "antd";
import {Data} from "../data/type";
import {useMemo} from "react";
import {EvaluatedSubmission, evaluateSubmission} from "../data/calculations";
import {ColumnsType} from "antd/lib/table";
import Paragraph from "antd/es/typography/Paragraph";
import {useSubmissions} from "../data/data-context";

const columns: ColumnsType<EvaluatedSubmission> = [
    {
        title: 'Team name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.score - b.score,
    },
    {
        title: 'Emissions',
        dataIndex: 'emissions',
        key: 'emissions',
        sorter: (a, b) => a.emissions - b.emissions,
    },
    {
        title: 'Aggregated',
        dataIndex: 'aggregatedScore',
        key: 'aggregatedScore',
        sorter: (a, b) => a.aggregatedScore - b.aggregatedScore,
    },
    {
        title: 'CO2 safe',
        dataIndex: 'co2Safe',
        key: 'co2Safe',
        sorter: (a, b) => a.co2Safe - b.co2Safe,
        render: (_, submission) => <Paragraph key={`co2Safe_${submission.name}`} type={submission.isBest ? "success": undefined}>{submission.co2Safe} {submission.isBest ? <img src={require('./leaf.png')} alt={'leaf'} style={{width: '16px', height: '16px'}}/>: null}</Paragraph>
    },
];

export const SubmissionsTable = ({numberOfRuns}: {numberOfRuns: number}) => {
    const submissions = useSubmissions();
    const evaluatedSubmissions = useMemo(() => {
        const bestScore = submissions.sort((a,b) => b.score - a.score)[0];
        const evaluated = submissions.map((submission) => ({
            ...evaluateSubmission(submission, bestScore, numberOfRuns || 1),
        }));
        const bestAggregated = evaluated.sort((a, b) => b.aggregatedScore - a.aggregatedScore)[0]

        return evaluated.map((submission => ({
            ...submission,
            isBest: submission.name === bestAggregated.name
        })))
    }, [submissions, numberOfRuns]);

    return <Table dataSource={evaluatedSubmissions} columns={columns} />;
}
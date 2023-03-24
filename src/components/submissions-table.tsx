import {Button, Dropdown, Input, InputNumber, Table, Typography} from "antd";
import {Data} from "../data/type";
import React, {useMemo, useState} from "react";
import {EvaluatedSubmission, evaluateSubmission} from "../data/calculations";
import {ColumnsType} from "antd/lib/table";
import Paragraph from "antd/es/typography/Paragraph";
import {useSubmissions} from "../data/data-context";
import {RcFile} from "antd/es/upload/interface";

const columns: ColumnsType<EvaluatedSubmission> = [
    {
        title: 'Team name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
    },
    {
        title: 'Accuracy',
        dataIndex: 'accuracy',
        key: 'accuracy',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.accuracy - b.accuracy,
    },
    {
        title: 'Emissions',
        dataIndex: 'emissions',
        key: 'emissions',
        sorter: (a, b) => a.emissions - b.emissions,
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b) => a.score - b.score,
    },
    {
        title: 'CO2 safe',
        dataIndex: 'co2Safe',
        key: 'co2Safe',
        sorter: (a, b) => a.co2Safe - b.co2Safe,
        render: (_, submission) => <Paragraph key={`co2Safe_${submission.name}`} type={submission.isBest ? "success": undefined}>{submission.co2Safe} {submission.isBest ? <img src={require('./leaf.png')} alt={'leaf'} style={{width: '16px', height: '16px'}}/>: null}</Paragraph>
    },
];

const countries = [
    {
        key: '1',
        label: 'Germany',
        coef: 1
    },
    {
        key: '2',
        label: 'China',
        coef: 2
    },
    {
        key: '3',
        label: 'USA',
        coef: 1.25
    },

]

export const SubmissionsTable = () => {
    const submissions = useSubmissions();
    const [country, setCountry] = useState<typeof countries[number]>(countries[0]);
    const [clients, setClients] = useState(100);
    const evaluatedSubmissions = useMemo(() => {
        const bestScore = submissions.sort((a,b) => b.accuracy - a.accuracy)[0];
        const evaluated =
            submissions.map(e => ({...e, emissions: e.emissions * country.coef})).map((submission) => ({
            ...evaluateSubmission(submission, {...bestScore, emissions: bestScore.emissions * country.coef}, clients || 1),
        }));
        const bestAggregated = evaluated.sort((a, b) => b.score - a.score)[0]

        return evaluated.map((submission => ({
            ...submission,
            accuracy: Number(submission.accuracy.toFixed(3)),
            score: Number(submission.score.toFixed(3)),
            emissions: Number(submission.emissions.toFixed(6)),
            co2Safe: Number(submission.co2Safe.toFixed(5)),
            isBest: submission.name === bestAggregated.name
        })))
    }, [submissions, clients, country]);

    return (
        <>
            <Table dataSource={evaluatedSubmissions} columns={columns}
                   caption={<span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px'}}>Country:
                       <Dropdown
                           menu={{
                               items: countries,
                               onClick: async ({key, domEvent}) => {
                                   domEvent.stopPropagation();
                                   setCountry(countries.find(e => e.key === key)!)
                               },
                           }}
                           placement="bottomLeft"
                           arrow
                       >
                    <Button onClick={(e) => e.stopPropagation()}>{country.label}</Button>
                </Dropdown>Number of client: <InputNumber<number> min={1} max={1000000000} placeholder={'Number of clients'} onChange={(e) => setClients(e || 100)} value={clients}/></span>}/>
        </>
    )
}
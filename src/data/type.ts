export interface Submission {
    name: string;
    score: number;
    emissions: number;
}

export interface Data {
    submissions: Submission[];
    numberOfRuns?: number;
}
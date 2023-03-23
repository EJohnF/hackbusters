export interface Submission {
    name: string;
    accuracy: number;
    emissions: number;
    score: number;
}

export interface Data {
    submissions: Submission[];
    numberOfRuns?: number;
}
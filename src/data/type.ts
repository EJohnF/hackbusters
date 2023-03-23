export interface Submission {
    name: string;
    score: number;
    consumption: number;
}

export interface Data {
    submissions: Submission[];
    numberOfRuns: number;
}
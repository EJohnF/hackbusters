export interface Submission {
    name: string;
    accuracy: number;
    emissions: number;
    score: number;
    gpu_model: string;
    cpu_model: string;
}

export interface Data {
    submissions: Submission[];
    numberOfRuns?: number;
}
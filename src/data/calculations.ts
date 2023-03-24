import { Submission } from "./type";

export type EvaluatedSubmission = Submission & {
    co2Safe: number;
    isBest?: boolean;
    hardware?: string;
}

export const evaluateSubmission = (submission: Submission, benchmark: Submission, multiplier: number): EvaluatedSubmission => {
    return {
        ...submission,
        score: calculateScore(submission.accuracy, submission.emissions),
        co2Safe: (benchmark.emissions - submission.emissions) * multiplier
    }
}

export const calculateScore = (accuracy: number, emissions: number): number =>
    (Math.pow(accuracy, 11) / emissions)
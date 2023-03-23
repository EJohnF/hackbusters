import {Submission} from "./type";

export type EvaluatedSubmission = Submission & {
    aggregatedScore: number;
    co2Safe: number;
    isBest?: boolean;
}

export const evaluateSubmission = (submission: Submission, benchmark: Submission, multiplier: number): EvaluatedSubmission => {
    return {
        ...submission,
        aggregatedScore: Number((submission.score / submission.emissions).toFixed(3)),
        co2Safe: (benchmark.emissions - submission.emissions) * multiplier
    }
}
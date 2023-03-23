import {Submission} from "./type";

export type EvaluatedSubmission = Submission & {
    co2Safe: number;
    isBest?: boolean;
}

export const evaluateSubmission = (submission: Submission, benchmark: Submission, multiplier: number): EvaluatedSubmission => {
    return {
        ...submission,
        co2Safe: (benchmark.emissions - submission.emissions) * multiplier
    }
}
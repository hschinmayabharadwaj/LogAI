'use server';

import { rankErrorSeverity, type RankErrorSeverityOutput } from '@/ai/flows/rank-severity';
import { suggestFix, type SuggestFixOutput } from '@/ai/flows/suggest-fix';
import { explainErrorLikeIm5, type ExplainErrorLikeIm5Output } from '@/ai/flows/explain-error';
import { summarizeTimeline, type SummarizeTimelineOutput } from '@/ai/flows/summarize-timeline';

export interface AnalysisResult {
    severity: RankErrorSeverityOutput;
    fix: SuggestFixOutput;
    eli5: ExplainErrorLikeIm5Output;
    timelineSummary: SummarizeTimelineOutput;
}

export async function analyzeLogFile(logContent: string): Promise<AnalysisResult> {
    try {
        const [severity, fix, eli5, timelineSummary] = await Promise.all([
            rankErrorSeverity({ log: logContent }),
            suggestFix({ errorLog: logContent }),
            explainErrorLikeIm5({ error: logContent }),
            summarizeTimeline({ logs: logContent }),
        ]);

        return {
            severity,
            fix,
            eli5,
            timelineSummary
        };
    } catch (error) {
        console.error("AI analysis failed:", error);
        throw new Error("The AI analysis service failed to process the log file.");
    }
}

'use server';

/**
 * @fileOverview Summarizes error logs over time to identify trends and track resolution progress.
 *
 * - summarizeTimeline - A function that handles the summarization of error logs over time.
 * - SummarizeTimelineInput - The input type for the summarizeTimeline function.
 * - SummarizeTimelineOutput - The return type for the summarizeTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTimelineInputSchema = z.object({
  logs: z
    .string()
    .describe("A string containing the application's logs over a period of time."),
});
export type SummarizeTimelineInput = z.infer<typeof SummarizeTimelineInputSchema>;

const SummarizeTimelineOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the error trends and resolution progress over time.'),
});
export type SummarizeTimelineOutput = z.infer<typeof SummarizeTimelineOutputSchema>;

export async function summarizeTimeline(input: SummarizeTimelineInput): Promise<SummarizeTimelineOutput> {
  return summarizeTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTimelinePrompt',
  input: {schema: SummarizeTimelineInputSchema},
  output: {schema: SummarizeTimelineOutputSchema},
  prompt: `You are an AI expert at summarizing application logs over time.

  Your goal is to identify trends in errors, and track the resolution progress.

  Here are the logs:
  {{logs}}
  `,
});

const summarizeTimelineFlow = ai.defineFlow(
  {
    name: 'summarizeTimelineFlow',
    inputSchema: SummarizeTimelineInputSchema,
    outputSchema: SummarizeTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

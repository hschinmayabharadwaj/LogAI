// This file uses server-side code.
'use server';

/**
 * @fileOverview Ranks the severity of an error log on a scale of 1 to 10.
 *
 * - rankErrorSeverity - A function that ranks the severity of an error log.
 * - RankErrorSeverityInput - The input type for the rankErrorSeverity function.
 * - RankErrorSeverityOutput - The return type for the rankErrorSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankErrorSeverityInputSchema = z.object({
  log: z.string().describe('The error log to rank.'),
});
export type RankErrorSeverityInput = z.infer<typeof RankErrorSeverityInputSchema>;

const RankErrorSeverityOutputSchema = z.object({
  severity: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe('The severity of the error, on a scale of 1 to 10.'),
  reason: z.string().optional().describe('The reason for the severity ranking.'),
});
export type RankErrorSeverityOutput = z.infer<typeof RankErrorSeverityOutputSchema>;

export async function rankErrorSeverity(input: RankErrorSeverityInput): Promise<RankErrorSeverityOutput> {
  return rankErrorSeverityFlow(input);
}

const rankErrorSeverityPrompt = ai.definePrompt({
  name: 'rankErrorSeverityPrompt',
  input: {schema: RankErrorSeverityInputSchema},
  output: {schema: RankErrorSeverityOutputSchema},
  prompt: `Given this error log, rank its severity from 1 (least severe) to 10 (most severe).
Error Log: {log}
Return a JSON object with severity and reason.`,
});

const rankErrorSeverityFlow = ai.defineFlow(
  {
    name: 'rankErrorSeverityFlow',
    inputSchema: RankErrorSeverityInputSchema,
    outputSchema: RankErrorSeverityOutputSchema,
  },
  async input => {
    const {output} = await rankErrorSeverityPrompt(input);
    return output!;
  }
);

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
  prompt: `You are an AI expert in classifying error log severity.

  Given the following error log, rank its severity on a scale of 1 to 10, where 1 is the least severe and 10 is the most severe.

  Error Log: {{{log}}}

  Justify your severity ranking, and return both the ranking, and the justification.

  Return your answer as a JSON object.
  `,
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

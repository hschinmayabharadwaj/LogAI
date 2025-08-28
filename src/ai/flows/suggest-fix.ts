// This file holds the Genkit flow for suggesting fixes for identified errors.

'use server';

/**
 * @fileOverview Implements the SuggestFixForError AI flow.
 *
 * - suggestFix - A function that suggests potential fixes for identified errors.
 * - SuggestFixInput - The input type for the suggestFix function.
 * - SuggestFixOutput - The return type for the suggestFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixInputSchema = z.object({
  errorLog: z.string().describe('The error log to analyze.'),
  relevantCodeSnippet: z
    .string()
    .optional()
    .describe('A relevant code snippet that might be helpful for the AI to suggest a fix.'),
});
export type SuggestFixInput = z.infer<typeof SuggestFixInputSchema>;

const SuggestFixOutputSchema = z.object({
  suggestedFix: z.string().describe('The suggested fix for the error.'),
  explanation: z.string().describe('Explanation of the suggested fix.'),
});
export type SuggestFixOutput = z.infer<typeof SuggestFixOutputSchema>;

export async function suggestFix(input: SuggestFixInput): Promise<SuggestFixOutput> {
  return suggestFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixPrompt',
  input: {schema: SuggestFixInputSchema},
  output: {schema: SuggestFixOutputSchema},
  prompt: `You are an AI expert in debugging and fixing code errors. A user will provide you with an error log and optionally a code snippet.  You will suggest a fix for the error and explain the fix.

Error log:
{{errorLog}}

{{#if relevantCodeSnippet}}
Relevant code snippet:
{{relevantCodeSnippet}}
{{/if}}
`,
});

const suggestFixFlow = ai.defineFlow(
  {
    name: 'suggestFixFlow',
    inputSchema: SuggestFixInputSchema,
    outputSchema: SuggestFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

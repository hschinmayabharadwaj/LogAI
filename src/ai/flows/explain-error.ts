// ExplainErrorLikeIm5 flow
'use server';

/**
 * @fileOverview Explains an error in simple terms, like the user is 5 years old.
 *
 * - explainErrorLikeIm5 - A function that handles the error explanation process.
 * - ExplainErrorLikeIm5Input - The input type for the explainErrorLikeIm5 function.
 * - ExplainErrorLikeIm5Output - The return type for the explainErrorLikeIm5 function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainErrorLikeIm5InputSchema = z.object({
  error: z.string().describe('The error to explain.'),
});
export type ExplainErrorLikeIm5Input = z.infer<typeof ExplainErrorLikeIm5InputSchema>;

const ExplainErrorLikeIm5OutputSchema = z.object({
  explanation: z.string().describe('The explanation of the error in simple terms.'),
});
export type ExplainErrorLikeIm5Output = z.infer<typeof ExplainErrorLikeIm5OutputSchema>;

export async function explainErrorLikeIm5(input: ExplainErrorLikeIm5Input): Promise<ExplainErrorLikeIm5Output> {
  return explainErrorLikeIm5Flow(input);
}

const prompt = ai.definePrompt({
  name: 'explainErrorLikeIm5Prompt',
  input: {schema: ExplainErrorLikeIm5InputSchema},
  output: {schema: ExplainErrorLikeIm5OutputSchema},
  prompt: `Explain the following error like I am 5 years old:\n\n{{{error}}}`,
});

const explainErrorLikeIm5Flow = ai.defineFlow(
  {
    name: 'explainErrorLikeIm5Flow',
    inputSchema: ExplainErrorLikeIm5InputSchema,
    outputSchema: ExplainErrorLikeIm5OutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

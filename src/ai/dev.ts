import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-fix.ts';
import '@/ai/flows/rank-severity.ts';
import '@/ai/flows/explain-error.ts';
import '@/ai/flows/summarize-timeline.ts';
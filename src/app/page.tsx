"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import type { AnalysisResult } from './actions';
import { analyzeLogFile } from './actions';
import Header from '@/components/header';
import LogUpload from '@/components/log-upload';
import TimelineSummary from '@/components/timeline-summary';
import ErrorCard from '@/components/error-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) {
        setError("File is empty or could not be read.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await analyzeLogFile(content);
        setAnalysisResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    }
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <Header />
      <main className="w-full max-w-4xl px-4 py-8 md:py-12 flex-grow">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Unlock Insights from Your Logs
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
            Upload a log file and let our AI assistant analyze errors, suggest fixes, and reveal hidden patterns.
          </p>
        </div>

        <LogUpload onFileSelect={handleFileUpload} disabled={isLoading} />
        
        <div className="mt-12 w-full space-y-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
              <p className="font-headline text-lg">Analyzing your log file...</p>
              <p className="text-sm">This may take a moment.</p>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert variant="destructive">
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {analysisResult && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {analysisResult.timelineSummary.summary && <TimelineSummary summary={analysisResult.timelineSummary.summary} />}
                <ErrorCard result={analysisResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="w-full text-center p-4 text-muted-foreground text-sm">
        <p>Built for the Hackathon. LogLens AI.</p>
      </footer>
    </div>
  );
}

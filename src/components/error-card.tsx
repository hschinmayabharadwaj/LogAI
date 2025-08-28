"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisResult } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, BotMessageSquare, Wrench } from "lucide-react";

interface ErrorCardProps {
  result: AnalysisResult;
}

export default function ErrorCard({ result }: ErrorCardProps) {
  const [isEli5, setIsEli5] = useState(false);

  const severityColor = (severity: number) => {
    if (severity >= 8) return "hsl(var(--destructive))";
    if (severity >= 5) return "hsl(var(--primary))";
    return "hsl(var(--accent))";
  };

  const explanationVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-md">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="font-headline">Error Analysis</CardTitle>
              <CardDescription>
                AI-powered breakdown of the primary error.
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-sm text-muted-foreground">SEVERITY</span>
            <p className="text-3xl font-bold" style={{ color: severityColor(result.severity.severity) }}>
              {result.severity.severity}/10
            </p>
          </div>
        </div>
        <div className="pt-4">
          <Progress value={result.severity.severity * 10} className="h-2" style={{ backgroundColor: severityColor(result.severity.severity) }} />
          <p className="text-xs text-muted-foreground mt-2">{result.severity.reason}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fix">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fix">
              <Wrench className="w-4 h-4 mr-2" /> Suggested Fix
            </TabsTrigger>
            <TabsTrigger value="explanation">
              <BotMessageSquare className="w-4 h-4 mr-2" /> Explanation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="fix" className="mt-4 p-4 bg-muted/50 rounded-md">
            <h3 className="font-semibold mb-2">Suggested Fix:</h3>
            <p className="text-sm text-foreground/90 mb-4">{result.fix.explanation}</p>
            <div className="bg-background rounded-md p-4 font-code text-sm overflow-x-auto">
              <pre><code>{result.fix.suggestedFix}</code></pre>
            </div>
          </TabsContent>
          <TabsContent value="explanation" className="mt-4 p-4 bg-muted/50 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI Explanation:</h3>
              <div className="flex items-center space-x-2">
                <Switch id="eli5-mode" checked={isEli5} onCheckedChange={setIsEli5} />
                <Label htmlFor="eli5-mode" className="text-xs">Explain Like I'm 5</Label>
              </div>
            </div>
            <div className="relative h-24">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isEli5 ? "eli5" : "normal"}
                  className="text-sm text-foreground/90 whitespace-pre-wrap absolute w-full"
                  variants={explanationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {isEli5 ? result.eli5.explanation : result.fix.explanation}
                </motion.p>
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

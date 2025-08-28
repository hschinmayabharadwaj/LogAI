import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

interface TimelineSummaryProps {
  summary: string;
}

export default function TimelineSummary({ summary }: TimelineSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline">Timeline Summary</CardTitle>
            <CardDescription>AI-generated overview of trends in your log file.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
      </CardContent>
    </Card>
  );
}

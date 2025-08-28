"use client";

import { useState, useRef, type DragEvent } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LogUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function LogUpload({ onFileSelect, disabled }: LogUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    if (file.type === "" || file.type.startsWith("text/")) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid log or text file.",
        variant: "destructive",
      });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300 text-center cursor-pointer ${
        disabled ? 'cursor-not-allowed bg-muted/50' :
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/80 hover:bg-muted/50'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="text/*,.log"
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-4">
        {fileName ? (
            <>
                <FileText className="w-12 h-12 text-primary" />
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{fileName}</span>
                    <span className="text-sm text-muted-foreground">Click or drop another file to replace</span>
                </div>
            </>
        ) : (
            <>
                <UploadCloud className="w-12 h-12 text-muted-foreground group-hover:text-primary" />
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">Drag & drop your log file here</span>
                    <span className="text-sm text-muted-foreground">or</span>
                    <Button variant="link" size="sm" className="text-primary" asChild>
                        <span>Choose a file</span>
                    </Button>
                </div>
            </>
        )}
      </div>
    </div>
  );
}

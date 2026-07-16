"use client";

import { useState, useRef } from "react";
import { ParsedReceipt } from "@/services/ai/receipt";
import { ReceiptReview } from "@/components/receipts/receipt-review";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileImage, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";

export default function ScanReceiptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedReceipt | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      
      if (!validTypes.includes(droppedFile.type)) {
        toast.error("Unsupported file type. Use JPG, PNG, or PDF.");
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setParsedData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ai/receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scan receipt");
      }

      const data = await response.json();
      setParsedData(data);
      toast.success("Receipt scanned successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Receipt Scanner" description="Upload and let AI automatically extract the items" />
      <div className="flex-1 w-full mx-auto max-w-4xl p-4 sm:p-6 space-y-6 animate-fade-in">

      {!parsedData ? (
        <Card className="border-border/40 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>We support JPG, PNG, and PDF up to 5MB.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div 
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : file ? "border-primary/50 bg-muted/20" : "border-border/60 hover:border-border hover:bg-muted/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
              />
              
              {isScanning ? (
                <div className="flex flex-col items-center gap-4 text-primary">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                    <Loader2 className="h-12 w-12 animate-spin relative z-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-lg">Scanning with Gemini Vision...</p>
                    <p className="text-sm text-muted-foreground">This usually takes about 3-5 seconds</p>
                  </div>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileImage className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-lg text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={handleReset}>
                      Choose Another
                    </Button>
                    <Button onClick={handleScan} className="bg-gradient-to-r from-violet-600 to-indigo-600">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Scan Receipt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-lg">Click or drag file to this area to upload</p>
                    <p className="text-sm text-muted-foreground">Please upload a clear, legible image</p>
                  </div>
                  <Button variant="secondary" className="mt-4 pointer-events-none">
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Review Receipt</CardTitle>
                <CardDescription>Verify the extracted data before saving</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur px-3 py-1.5 rounded-full border border-border/50 text-sm">
                <span className="text-muted-foreground">AI Confidence:</span>
                <span className={`font-semibold ${parsedData.confidence > 0.8 ? 'text-green-500' : parsedData.confidence > 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                  {Math.round(parsedData.confidence * 100)}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ReceiptReview 
              initialData={parsedData} 
              onCancel={handleReset} 
            />
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

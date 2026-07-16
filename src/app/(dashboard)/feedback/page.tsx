"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquarePlus, Send } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("FEATURE");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, content })
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      toast.success("Thank you for your feedback!");
      setSubject("");
      setContent("");
      setCategory("FEATURE");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback Center</h1>
        <p className="text-muted-foreground mt-1">Help us improve FinanceAI by sharing your thoughts.</p>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-indigo-500" />
            Submit Feedback
          </CardTitle>
          <CardDescription>Found a bug or have a feature request? Let us know below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="E.g., Dark mode issue" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUG">Bug Report</SelectItem>
                    <SelectItem value="FEATURE">Feature Request</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Please describe your feedback in detail..." 
                className="min-h-[150px]"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
              {isSubmitting ? "Submitting..." : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MessageSquareCode, Save, Clock } from "lucide-react";

export default function PromptManager() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prompts");
      const data = await res.json();
      setPrompts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSave = async (id: string) => {
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, prompt: editValue })
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success("Prompt updated successfully");
      setEditingId(null);
      fetchPrompts();
    } catch (error) {
      toast.error("Failed to save prompt");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-6 bg-zinc-800" />
        <Skeleton className="h-96 w-full bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Manager</h1>
        <p className="text-zinc-400 mt-1">Manage system prompts dynamically without redeploying.</p>
      </div>

      <div className="grid gap-6">
        {prompts.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 border-dashed text-zinc-50 py-12">
            <CardContent className="flex flex-col items-center text-center">
              <MessageSquareCode className="h-12 w-12 opacity-20 mb-4" />
              <p className="text-zinc-400">No prompts stored in database yet.</p>
            </CardContent>
          </Card>
        ) : (
          prompts.map((p) => (
            <Card key={p.id} className="bg-zinc-900 border-zinc-800 text-zinc-50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {p.name}
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      v{p.version}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">{p.description}</CardDescription>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last updated: {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <Textarea 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="min-h-[200px] font-mono text-xs bg-zinc-950 border-zinc-800 text-zinc-300"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handleSave(p.id)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4 text-xs font-mono text-zinc-400 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {p.prompt}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => { setEditingId(p.id); setEditValue(p.prompt); }}>
                        Edit Prompt
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Zap } from "lucide-react";

export default function FeatureFlags() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/features");
      const data = await res.json();
      setFlags(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load feature flags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const toggleFlag = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Feature flag updated");
      fetchFlags();
    } catch (error) {
      toast.error("Failed to update feature flag");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-6 bg-zinc-800" />
        <Skeleton className="h-64 w-full bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-zinc-400 mt-1">Dynamically enable or disable application features.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-zinc-500" />
            Active Features
          </CardTitle>
          <CardDescription className="text-zinc-400">Changes apply globally to all users immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 divide-y divide-zinc-800">
            {flags.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                <p>No feature flags configured.</p>
              </div>
            ) : (
              flags.map((flag) => (
                <div key={flag.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-base">{flag.name}</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">{flag.description}</p>
                    <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded mt-2 inline-block text-zinc-300">{flag.key}</code>
                  </div>
                  <Switch 
                    checked={flag.enabled} 
                    onCheckedChange={() => toggleFlag(flag.id, flag.enabled)} 
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

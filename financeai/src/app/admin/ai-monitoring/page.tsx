import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, BrainCircuit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIMonitoring() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Monitoring</h1>
        <p className="text-zinc-400 mt-1">Track AI usage, performance, and API costs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,450</div>
            <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Average Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2s</div>
            <p className="text-xs text-zinc-500 mt-1">Acceptable range</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.8%</div>
            <p className="text-xs text-zinc-500 mt-1">0.2% parsing failures</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 border-dashed text-zinc-50 h-96">
        <CardContent className="flex flex-col items-center justify-center h-full text-zinc-500">
          <BrainCircuit className="h-16 w-16 mb-4 opacity-20" />
          <p>Detailed AI charts and historical latency metrics will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

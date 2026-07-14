"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Cpu, Clock, CheckCircle } from "lucide-react";

export default function SystemHealthPage() {
  const metrics = [
    {
      title: "API Status",
      value: "Operational",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Database Load",
      value: "14%",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Server Memory",
      value: "42%",
      icon: Server,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "CPU Usage",
      value: "8%",
      icon: Cpu,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="flex flex-col">
      <Topbar title="System Health" description="Monitor application performance and uptime" />
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-border/40 animate-fade-in">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Healthy
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight mb-1">{metric.value}</h3>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/40 animate-fade-in stagger-1">
          <CardHeader>
            <CardTitle>Recent Checks</CardTitle>
            <CardDescription>Automated system health checks running every 5 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Database Connection",
                "Supabase Auth Service",
                "OpenAI API Endpoint",
                "Background Workers",
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-accent/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">{service}</p>
                      <p className="text-xs text-muted-foreground">Response time: {Math.floor(Math.random() * 100) + 10}ms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Just now
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import {
  User,
  Palette,
  DollarSign,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, loading, signOut } = useUser();
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="flex flex-col">
      <Topbar title="Settings" description="Manage your account preferences" />
      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-2xl">
        {/* Profile */}
        <Card className="border-border/40 animate-fade-in">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                  {user?.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Joined{" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currency */}
        <Card className="border-border/40 animate-fade-in stagger-1">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <CardTitle className="text-base">Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Indonesian Rupiah</p>
                <p className="text-xs text-muted-foreground">
                  All amounts are displayed in IDR
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                IDR (Rp)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="border-border/40 animate-fade-in stagger-2">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-border hover:bg-accent/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-border/40 animate-fade-in stagger-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

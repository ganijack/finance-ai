"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditProfilePage() {
  const { user, loading } = useUser();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Logic to save to Prisma via API would go here.
      // For now, we simulate a delay.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground">
            <Link href="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
        </div>

        <Card className="border-border/40 animate-fade-in">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your photo and personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar upload */}
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-2xl uppercase overflow-hidden border-2 border-primary/30">
                      {user?.email?.[0] || "?"}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Profile Photo</h3>
                    <p className="text-xs text-muted-foreground mb-2">JPG, GIF or PNG. Max size of 2MB.</p>
                    <Button type="button" variant="outline" size="sm">
                      Upload new
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="bg-muted/50"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Email address cannot be changed. Contact support if you need to migrate your account.
                  </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/40">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

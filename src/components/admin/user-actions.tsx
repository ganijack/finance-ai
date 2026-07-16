"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, User, Ban } from "lucide-react";
import { toast } from "sonner";

interface UserActionsProps {
  userId: string;
  email: string;
  role: string;
}

export function UserActions({ userId, email, role }: UserActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: "ADMIN" | "USER") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update role");
      }

      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async () => {
    if (!confirm(`Are you sure you want to ban ${email}? They will no longer be able to access their dashboard.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to ban user");
      }

      toast.success("User has been banned");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-100">
        {role === "USER" ? (
          <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-indigo-400">
            <Shield className="mr-2 h-4 w-4" />
            Promote to Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleRoleChange("USER")} className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Demote to User
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem onClick={handleBan} className="text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-400 focus:text-red-400 cursor-pointer">
          <Ban className="mr-2 h-4 w-4" />
          Ban Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

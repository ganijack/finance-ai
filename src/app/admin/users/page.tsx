import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, UserX, MoreHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersManagement() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-zinc-400 mt-1">Manage accounts, roles, and access.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription className="text-zinc-400">Showing users currently recorded in the local database.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">User ID</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.email}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{u.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                      <UserX className="h-8 w-8 mx-auto mb-3 opacity-20" />
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-500/90 text-sm">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p>
              <strong>Note:</strong> Role management is currently handled manually via Prisma Studio. To grant Admin access, open Prisma Studio and change the role column to <code>ADMIN</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8">
        <BrandLogo />
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6 border-4 border-red-500/20">
        <ShieldAlert className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-6xl font-bold tracking-tight mb-2 text-foreground">
        403
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        Access Denied
      </h2>
      <p className="text-muted-foreground max-w-md text-center mb-8">
        You do not have permission to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8">
        <BrandLogo />
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-6xl font-bold tracking-tight mb-2 text-foreground">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
        Page Not Found
      </h2>
      <p className="text-muted-foreground max-w-md text-center mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          <div className="mb-8">
            <BrandLogo />
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6 border-4 border-red-500/20">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground max-w-md text-center mb-8">
            We apologize for the inconvenience. A critical error has occurred. Our team has been notified.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => reset()} variant="default">
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

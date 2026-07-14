import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background p-4">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
      <div className="w-full max-w-[400px] animate-fade-in">{children}</div>
    </div>
  );
}

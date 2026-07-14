import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Authenticate with a pre-configured demo account
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@financeai.com",
      password: "DemoPassword123!",
    });

    if (error) {
      console.error("Demo login error:", error);
      // Fallback: If demo account doesn't exist, we could create it, or just show an error.
      return NextResponse.redirect(new URL("/login?error=demo_unavailable", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/login?error=demo_failed", request.url));
  }
}

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client for Client Components.
 * 
 * Manages client authentication state, realtime subscriptions,
 * and user session access in the browser.
 * 
 * @returns A browser-compatible Supabase client instance.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

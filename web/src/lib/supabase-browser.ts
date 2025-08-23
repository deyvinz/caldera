import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  if (typeof window === "undefined" || !supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        async getUser() {
          return { data: { user: null } } as any;
        },
      },
    } as any;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}



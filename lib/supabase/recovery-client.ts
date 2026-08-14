import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let recoveryClient: ReturnType<typeof createSupabaseClient> | undefined;

export function createRecoveryClient() {
  if (!recoveryClient) {
    recoveryClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          flowType: "implicit",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    );
  }

  return recoveryClient;
}

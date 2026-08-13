"use server";

import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export async function adminLogout() {
  const { supabase, tokenHash } = await requireAdmin();
  await supabase.rpc("revoke_admin_session", { session_token_hash: tokenHash });
  const { ADMIN_COOKIE } = await import("@/lib/admin");
  const { cookies } = await import("next/headers");
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

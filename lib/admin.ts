import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "expense_admin_session";
export const hashAdminToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  const supabase = await createClient();
  const { data: username, error } = await supabase.rpc("verify_admin_session", { session_token_hash: hashAdminToken(token) });
  if (error || !username) redirect("/admin/login");
  return { supabase, username: String(username), tokenHash: hashAdminToken(token) };
}

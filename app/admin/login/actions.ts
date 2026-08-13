"use server";

import { ADMIN_COOKIE, hashAdminToken } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminLoginState = { error?: "required" | "invalid" };

export async function adminLogin(
  _state: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return { error: "required" };

  const supabase = await createClient();
  const token = randomBytes(32).toString("base64url");
  const { data, error } = await supabase.rpc("authenticate_admin", {
    login_username: username,
    login_password: password,
    new_token_hash: hashAdminToken(token),
  });
  if (error || !data) return { error: "invalid" };

  (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });

  redirect("/admin");
}

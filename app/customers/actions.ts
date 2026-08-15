"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readName(formData: FormData) {
  return String(formData.get("name") ?? "").trim();
}

export async function createCustomer(formData: FormData) {
  const name = readName(formData);
  if (!name || name.length > 100) redirect("/customers?error=invalid");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/customers");

  const { data: existing } = await supabase.from("customers")
    .select("name").eq("user_id", user.id);
  if (existing?.some((customer) => customer.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    redirect("/customers?error=duplicate");
  }

  const { error } = await supabase.from("customers").insert({ name, user_id: user.id });
  if (error?.code === "23505") redirect("/customers?error=duplicate");
  if (error) redirect("/customers?error=create");
  revalidatePath("/customers");
  redirect("/customers");
}

export async function updateCustomer(formData: FormData) {
  const id = Number(String(formData.get("customerId") ?? ""));
  const name = readName(formData);
  if (!Number.isSafeInteger(id) || id <= 0 || !name || name.length > 100) redirect("/customers?error=invalid");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/customers");

  const { data: existing } = await supabase.from("customers")
    .select("id, name").eq("user_id", user.id).neq("id", id);
  if (existing?.some((customer) => customer.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    redirect("/customers?error=duplicate");
  }

  const { data, error } = await supabase.from("customers")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error?.code === "23505") redirect("/customers?error=duplicate");
  if (error || !data) redirect("/customers?error=update");
  revalidatePath("/customers");
  redirect("/customers");
}

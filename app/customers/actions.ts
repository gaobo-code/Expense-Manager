"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readName(formData: FormData) {
  return String(formData.get("name") ?? "").trim();
}

export async function createCustomer(_previousState: { success: boolean }, formData: FormData) {
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
  return { success: true };
}

export async function updateCustomer(_previousState: { success: boolean }, formData: FormData) {
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
  return { success: true };
}

export type DeleteCustomerState = { success: boolean; error: "in-use" | "failed" | null };

export async function deleteCustomer(_previousState: DeleteCustomerState, formData: FormData): Promise<DeleteCustomerState> {
  const id = Number(String(formData.get("customerId") ?? ""));
  if (!Number.isSafeInteger(id) || id <= 0) return { success: false, error: "failed" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/customers");

  const { data: customer, error: customerError } = await supabase.from("customers")
    .select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (customerError || !customer) return { success: false, error: "failed" };

  const { data: transaction, error: transactionError } = await supabase.from("transactions")
    .select("id").eq("customer_id", id).limit(1).maybeSingle();
  if (transactionError) return { success: false, error: "failed" };
  if (transaction) return { success: false, error: "in-use" };

  const { data: deletedCustomer, error: deleteError } = await supabase.from("customers")
    .delete().eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (deleteError || !deletedCustomer) return { success: false, error: "failed" };

  revalidatePath("/customers");
  revalidatePath("/");
  return { success: true, error: null };
}

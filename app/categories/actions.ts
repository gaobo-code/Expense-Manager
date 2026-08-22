"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readName(formData: FormData, key: "nameZh" | "nameEn") {
  return String(formData.get(key) ?? "").trim();
}

export async function createUserCategory(_previousState: { success: boolean }, formData: FormData) {
  const nameZh = readName(formData, "nameZh");
  const nameEn = readName(formData, "nameEn");
  const parentValue = String(formData.get("parentId") ?? "").trim();
  const parentId = parentValue ? Number(parentValue) : null;
  const amountEffect = String(formData.get("amountEffect") ?? "");

  if ((!nameZh && !nameEn) || nameZh.length > 60 || nameEn.length > 60) {
    redirect("/categories?error=invalid");
  }
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId <= 0)) {
    redirect("/categories?error=parent");
  }
  if (amountEffect !== "increase" && amountEffect !== "decrease") redirect("/categories?error=invalid");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/categories");

  if (parentId !== null) {
    const { data: parent } = await supabase
      .from("categories")
      .select("id, user_id, amount_effect")
      .eq("id", parentId)
      .is("parent_id", null)
      .maybeSingle();
    if (!parent || (parent.user_id !== null && parent.user_id !== user.id)) redirect("/categories?error=parent");
  }

  const { data: createdCategory, error } = await supabase.from("categories").insert({
    name_zh: nameZh,
    name_en: nameEn,
    parent_id: parentId,
    user_id: user.id,
    amount_effect: amountEffect,
  }).select("id").single();
  if (error || !createdCategory) redirect("/categories?error=create");

  // Older databases may still have a trigger that copies amount_effect from
  // the parent during INSERT. Updating only amount_effect does not invoke that
  // trigger, so the user's explicit choice remains authoritative.
  const { data: savedCategory, error: amountEffectError } = await supabase
    .from("categories")
    .update({ amount_effect: amountEffect, updated_at: new Date().toISOString() })
    .eq("id", createdCategory.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();
  if (amountEffectError || !savedCategory) redirect("/categories?error=create");

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateUserCategory(_previousState: { success: boolean }, formData: FormData) {
  const categoryId = Number(String(formData.get("categoryId") ?? "").trim());
  const nameZh = readName(formData, "nameZh");
  const nameEn = readName(formData, "nameEn");

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0 || (!nameZh && !nameEn) || nameZh.length > 60 || nameEn.length > 60) {
    redirect("/categories?error=invalid");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/categories");

  const { data, error } = await supabase
    .from("categories")
    .update({ name_zh: nameZh, name_en: nameEn, updated_at: new Date().toISOString() })
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/categories?error=update");

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export type DeleteCategoryState = { success: boolean; error: "in-use" | "failed" | null };

export async function deleteUserCategory(_previousState: DeleteCategoryState, formData: FormData): Promise<DeleteCategoryState> {
  const categoryId = Number(String(formData.get("categoryId") ?? "").trim());
  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) return { success: false, error: "failed" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/categories");

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (categoryError || !category) return { success: false, error: "failed" };

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .select("id")
    .eq("category_id", categoryId)
    .limit(1)
    .maybeSingle();
  if (transactionError) return { success: false, error: "failed" };
  if (transaction) return { success: false, error: "in-use" };

  const { data: deletedCategory, error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();
  if (deleteError || !deletedCategory) return { success: false, error: deleteError?.code === "23503" ? "in-use" : "failed" };

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true, error: null };
}

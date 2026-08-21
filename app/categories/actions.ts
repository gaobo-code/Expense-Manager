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

  if ((!nameZh && !nameEn) || nameZh.length > 60 || nameEn.length > 60) {
    redirect("/categories?error=invalid");
  }
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId <= 0)) {
    redirect("/categories?error=parent");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/categories");

  if (parentId !== null) {
    const { data: parent } = await supabase
      .from("categories")
      .select("id, user_id")
      .eq("id", parentId)
      .is("parent_id", null)
      .maybeSingle();
    if (!parent || (parent.user_id !== null && parent.user_id !== user.id)) redirect("/categories?error=parent");
  }

  const { error } = await supabase.from("categories").insert({
    name_zh: nameZh,
    name_en: nameEn,
    parent_id: parentId,
    user_id: user.id,
  });
  if (error) redirect("/categories?error=create");

  revalidatePath("/categories");
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
  return { success: true };
}

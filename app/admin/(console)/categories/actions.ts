"use server";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function createCommonCategory(_previousState: { success: boolean }, formData: FormData) {
  const nameZh = String(formData.get("nameZh") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const parentValue = String(formData.get("parentId") ?? "").trim();
  const amountEffect = String(formData.get("amountEffect") ?? "");
  if (!nameZh || !nameEn || nameZh.length > 60 || nameEn.length > 60) redirect("/admin/categories?error=invalid");
  const parentId = parentValue ? Number(parentValue) : null;
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId <= 0)) redirect("/admin/categories?error=parent");
  if (amountEffect !== "increase" && amountEffect !== "decrease") redirect("/admin/categories?error=invalid");
  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_create_category", { session_token_hash: tokenHash, category_name_zh: nameZh, category_name_en: nameEn, category_parent_id: parentId, category_amount_effect: amountEffect });
  if (error) redirect("/admin/categories?error=create");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCommonCategory(_previousState: { success: boolean }, formData: FormData) {
  const categoryId = Number(String(formData.get("categoryId") ?? "").trim());
  const nameZh = String(formData.get("nameZh") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) redirect("/admin/categories?error=update");
  if (!nameZh || !nameEn || nameZh.length > 60 || nameEn.length > 60) redirect("/admin/categories?error=invalid");

  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_update_category", {
    session_token_hash: tokenHash,
    category_id: categoryId,
    category_name_zh: nameZh,
    category_name_en: nameEn,
  });

  if (error) redirect("/admin/categories?error=update");
  revalidatePath("/admin/categories");
  return { success: true };
}

export type DeleteCommonCategoryState = { success: boolean; error: "in-use" | "failed" | null };

export async function deleteCommonCategory(_previousState: DeleteCommonCategoryState, formData: FormData): Promise<DeleteCommonCategoryState> {
  const categoryId = Number(String(formData.get("categoryId") ?? "").trim());
  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) return { success: false, error: "failed" };

  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_delete_category", {
    session_token_hash: tokenHash,
    category_id: categoryId,
  });
  if (error) return { success: false, error: error.code === "23503" || error.message.includes("category_in_use") ? "in-use" : "failed" };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true, error: null };
}

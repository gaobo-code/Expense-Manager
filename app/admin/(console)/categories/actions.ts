"use server";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function createCommonCategory(formData: FormData) {
  const nameZh = String(formData.get("nameZh") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const parentValue = String(formData.get("parentId") ?? "").trim();
  if (!nameZh || !nameEn || nameZh.length > 60 || nameEn.length > 60) redirect("/admin/categories?error=invalid");
  const parentId = parentValue ? Number(parentValue) : null;
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId <= 0)) redirect("/admin/categories?error=parent");
  const { supabase, tokenHash } = await requireAdmin();
  const { error } = await supabase.rpc("admin_create_category", { session_token_hash: tokenHash, category_name_zh: nameZh, category_name_en: nameEn, category_parent_id: parentId });
  if (error) redirect("/admin/categories?error=create");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

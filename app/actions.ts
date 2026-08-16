"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const accountTypes = new Set(["credit_card", "cash", "bank"]);
const currencies = new Set(["USD", "CNY"]);

export type QuickCreateResult = { ok: true; id: number; name: string; nameZh?: string; nameEn?: string; parentId?: number | null } | { ok: false; message: string };

function fail(code: string): never {
  return redirect(`/?error=${code}`);
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export async function createQuickCategory(nameZhValue: string, nameEnValue: string, parentValue: string): Promise<QuickCreateResult> {
  const nameZh = nameZhValue.trim();
  const nameEn = nameEnValue.trim();
  const parentId = parentValue ? Number(parentValue) : null;
  if ((!nameZh && !nameEn) || nameZh.length > 60 || nameEn.length > 60) return { ok: false, message: "invalid" };
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId <= 0)) return { ok: false, message: "invalid" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "unauthorized" };
  if (parentId !== null) {
    const { data: parent } = await supabase.from("categories").select("id, user_id").eq("id", parentId).is("parent_id", null).maybeSingle();
    if (!parent || (parent.user_id !== null && parent.user_id !== user.id)) return { ok: false, message: "parent" };
  }
  const { data, error } = await supabase.from("categories").insert({
    user_id: user.id, parent_id: parentId, name_zh: nameZh, name_en: nameEn,
  }).select("id").single();
  if (error || !data) return { ok: false, message: "create" };
  revalidatePath("/");
  revalidatePath("/categories");
  return { ok: true, id: data.id, name: nameZh || nameEn, nameZh, nameEn, parentId };
}

export async function createQuickCustomer(nameValue: string): Promise<QuickCreateResult> {
  const name = nameValue.trim();
  if (!name || name.length > 100) return { ok: false, message: "invalid" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "unauthorized" };
  const { data: existing } = await supabase.from("customers").select("id, name").eq("user_id", user.id);
  const match = existing?.find((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (match) return { ok: true, id: match.id, name: match.name };
  const { data, error } = await supabase.from("customers").insert({ user_id: user.id, name }).select("id").single();
  if (error || !data) return { ok: false, message: "create" };
  revalidatePath("/");
  revalidatePath("/customers");
  return { ok: true, id: data.id, name };
}

async function readRelations(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, formData: FormData) {
  let categoryId = Number(String(formData.get("categoryId") ?? ""));
  let customerId = Number(String(formData.get("customerId") ?? ""));
  const newCategory = String(formData.get("newCategory") ?? "").trim();
  const newCustomer = String(formData.get("newCustomer") ?? "").trim();

  if (newCategory) {
    if (newCategory.length > 60) fail("invalid");
    const { data, error } = await supabase.from("categories").insert({
      user_id: userId, parent_id: null, name_zh: newCategory, name_en: newCategory,
    }).select("id").single();
    if (error || !data) fail("category");
    categoryId = data.id;
  }
  if (newCustomer) {
    if (newCustomer.length > 100) fail("invalid");
    const { data: matches } = await supabase.from("customers").select("id, name").eq("user_id", userId);
    const match = matches?.find((item) => item.name.toLocaleLowerCase() === newCustomer.toLocaleLowerCase());
    if (match) customerId = match.id;
    else {
      const { data, error } = await supabase.from("customers").insert({ user_id: userId, name: newCustomer }).select("id").single();
      if (error || !data) fail("customer");
      customerId = data.id;
    }
  }

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) fail("invalid");
  if (customerId && (!Number.isSafeInteger(customerId) || customerId <= 0)) fail("invalid");

  const [{ data: category }, { data: customer }] = await Promise.all([
    supabase.from("categories").select("id, user_id, name_zh, name_en").eq("id", categoryId).maybeSingle(),
    customerId ? supabase.from("customers").select("id").eq("id", customerId).eq("user_id", userId).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!category || (category.user_id !== null && category.user_id !== userId) || (customerId && !customer)) fail("invalid");
  return { categoryId, customerId: customerId || null, category: category.name_zh || category.name_en };
}

async function transactionValues(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const amount = Number(String(formData.get("amount") ?? ""));
  const accountType = String(formData.get("accountType") ?? "");
  const currency = String(formData.get("currency") ?? "");
  if (!validDate(date) || !Number.isFinite(amount) || amount < 0 || amount > 9999999999.99 || !accountTypes.has(accountType) || !currencies.has(currency)) fail("invalid");
  return { date, amount, accountType, currency };
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/");
  const values = await transactionValues(formData);
  const relations = await readRelations(supabase, user.id, formData);
  const { error } = await supabase.from("transactions").insert({
    user_id: user.id, transaction_date: values.date,
    amount: values.amount, account_type: values.accountType, currency: values.currency,
    category_id: relations.categoryId, category: relations.category, customer_id: relations.customerId,
  });
  if (error) fail("create");
  revalidatePath("/");
  redirect("/");
}

export async function updateTransaction(formData: FormData) {
  const id = Number(String(formData.get("transactionId") ?? ""));
  if (!Number.isSafeInteger(id) || id <= 0) fail("invalid");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/");
  const values = await transactionValues(formData);
  const relations = await readRelations(supabase, user.id, formData);
  const { data, error } = await supabase.from("transactions").update({
    transaction_date: values.date, amount: values.amount,
    account_type: values.accountType, currency: values.currency, category_id: relations.categoryId,
    category: relations.category, customer_id: relations.customerId, updated_at: new Date().toISOString(),
  }).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) fail("update");
  revalidatePath("/");
  redirect("/");
}

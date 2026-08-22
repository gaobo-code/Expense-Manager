import type { Metadata } from "next";
import { CategoriesView } from "@/components/categories-view";
import type { Category } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Categories | Money Manager" };
export const instant = false;

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const query = await searchParams;
  const { data, error } = await supabase
    .from("categories")
    .select("id, parent_id, user_id, name_zh, name_en, amount_effect, sort_order, created_at, updated_at")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  return <CategoriesView categories={(data ?? []) as Category[]} hasError={Boolean(error)} errorCode={query.error} />;
}

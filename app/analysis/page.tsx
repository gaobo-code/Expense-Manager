import { AnalysisView } from "@/components/analysis-view";
import type { Transaction } from "@/components/transactions-view";
import type { Category } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AnalysisPage() {
  const supabase = await createClient();
  const [transactionsResult, categoriesResult] = await Promise.all([
    supabase.from("transactions").select("id, transaction_date, amount, category, category_id, account_type, currency, customer_id").order("transaction_date", { ascending: true }),
    supabase.from("categories").select("id, name_zh, name_en, parent_id, user_id"),
  ]);

  return <AnalysisView transactions={(transactionsResult.data ?? []) as Transaction[]} categories={(categoriesResult.data ?? []) as Category[]} hasError={Boolean(transactionsResult.error || categoriesResult.error)} />;
}

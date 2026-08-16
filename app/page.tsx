import { createClient } from "@/lib/supabase/server";
import { TransactionsView, type Transaction } from "@/components/transactions-view";
import type { Category } from "@/lib/categories";
import type { Customer } from "@/lib/customers";

export const instant = false;

export default async function Home({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const query = await searchParams;
  const [transactionsResult, categoriesResult, customersResult] = await Promise.all([
    supabase.from("transactions").select("id, transaction_date, amount, category, category_id, account_type, currency, customer_id, customers(name)").order("transaction_date", { ascending: false }),
    supabase.from("categories").select("id, parent_id, user_id, name_zh, name_en, sort_order, created_at, updated_at").order("created_at"),
    supabase.from("customers").select("id, user_id, name, created_at, updated_at").order("name"),
  ]);
  return <TransactionsView
    transactions={(transactionsResult.data ?? []) as unknown as Transaction[]}
    categories={(categoriesResult.data ?? []) as Category[]}
    customers={(customersResult.data ?? []) as Customer[]}
    hasError={Boolean(transactionsResult.error || categoriesResult.error || customersResult.error)}
    errorCode={query.error}
  />;
}

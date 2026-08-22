import type { Metadata } from "next";
import { AccountBalancesView } from "@/components/account-balances-view";
import type { Transaction } from "@/components/transactions-view";
import type { Category } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Accounts | Money Manager" };
export const instant = false;

export default async function AccountsPage() {
  const supabase = await createClient();
  const [transactionsResult, categoriesResult] = await Promise.all([
    supabase.from("transactions").select("id, transaction_date, amount, category, category_id, account_type, currency, customer_id").order("transaction_date", { ascending: true }),
    supabase.from("categories").select("id, parent_id, user_id, name_zh, name_en, amount_effect, sort_order, created_at, updated_at").order("created_at", { ascending: true }),
  ]);

  return (
    <AccountBalancesView
      transactions={(transactionsResult.data ?? []) as Transaction[]}
      categories={(categoriesResult.data ?? []) as Category[]}
      hasError={Boolean(transactionsResult.error || categoriesResult.error)}
    />
  );
}

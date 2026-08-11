import { createClient } from "@/lib/supabase/server";
import { TransactionsView, type Transaction } from "@/components/transactions-view";

export const instant = false;

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, transaction_date, amount, category")
    .order("transaction_date", { ascending: false });

  const transactions = (data ?? []) as Transaction[];

  return <TransactionsView transactions={transactions} hasError={Boolean(error)} />;
}

import type { Metadata } from "next";
import { CustomersView } from "@/components/customers-view";
import type { Customer } from "@/lib/customers";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Customers | Money Manager" };
export const instant = false;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const query = await searchParams;
  const { data, error } = await supabase.from("customers")
    .select("id, user_id, name, created_at, updated_at")
    .order("created_at", { ascending: false });
  return <CustomersView customers={(data ?? []) as Customer[]} hasError={Boolean(error)} errorCode={query.error} />;
}

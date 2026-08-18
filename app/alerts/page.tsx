import type { Metadata } from "next";
import { AlertsView } from "@/components/alerts-view";
import type { Notice } from "@/lib/notices";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Alerts | Money Manager" };
export const instant = false;

export default async function AlertsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_notices");

  return <AlertsView notices={(data ?? []) as Notice[]} hasError={Boolean(error)} />;
}

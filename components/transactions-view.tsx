"use client";

import { PageShell } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";

export type Transaction = { id: number; transaction_date: string; amount: number; category: string };

export function TransactionsView({ transactions, hasError }: { transactions: Transaction[]; hasError: boolean }) {
  const { language, t } = useLanguage();
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" });
  const amountFormatter = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });

  return (
    <PageShell>
      <section>
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">{t("appName")}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("transactions")}</h1>
          <p className="mt-2 text-slate-500">{t("transactionsDescription")}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {hasError ? <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">{t("unavailable")}</div> : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4 font-semibold">{t("date")}</th><th className="px-6 py-4 text-right font-semibold">{t("amount")}</th><th className="px-6 py-4 font-semibold">{t("category")}</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => <tr className="transition-colors hover:bg-slate-50" key={transaction.id}><td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700">{dateFormatter.format(new Date(`${transaction.transaction_date}T00:00:00Z`))}</td><td className="whitespace-nowrap px-6 py-5 text-right text-sm font-semibold tabular-nums text-slate-950">{amountFormatter.format(transaction.amount)}</td><td className="px-6 py-5 text-sm text-slate-600"><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">{transaction.category}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

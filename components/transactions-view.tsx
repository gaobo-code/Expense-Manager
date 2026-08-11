"use client";

import { PageShell } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";

export type Transaction = { id: number; transaction_date: string; amount: number; category: string };

export function TransactionsView({ transactions, hasError }: { transactions: Transaction[]; hasError: boolean }) {
  const { language, formatDate, t } = useLanguage();
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const amountFormatter = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });

  return (
    <PageShell>
      <section>
        <div className="mb-8 hidden md:block">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">{t("appName")}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("transactions")}</h1>
          <p className="mt-2 text-slate-500">{t("transactionsDescription")}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {hasError ? <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">{t("unavailable")}</div> : null}
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left">
              <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500 md:text-xs md:tracking-wider"><tr><th className="px-2 py-3 font-semibold md:px-6 md:py-4">{t("date")}</th><th className="px-2 py-3 text-left font-semibold md:px-6 md:py-4">{t("amount")}</th><th className="px-2 py-3 font-semibold md:px-6 md:py-4">{t("category")}</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => <tr className="transition-colors hover:bg-slate-50" key={transaction.id}><td className="break-words px-2 py-4 text-xs font-medium text-slate-700 md:whitespace-nowrap md:px-6 md:py-5 md:text-sm">{formatDate(`${transaction.transaction_date}T00:00:00Z`)}</td><td className="break-words px-2 py-4 text-left text-xs font-semibold tabular-nums text-slate-950 md:whitespace-nowrap md:px-6 md:py-5 md:text-sm">{amountFormatter.format(transaction.amount)}</td><td className="break-words px-2 py-4 text-xs text-slate-600 md:px-6 md:py-5 md:text-sm"><span className="inline-flex max-w-full break-words rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700 md:px-3">{transaction.category}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

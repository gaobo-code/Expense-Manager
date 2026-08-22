"use client";

import { UserRound, UsersRound } from "lucide-react";
import { CustomerDeleteButton, CustomerDialog } from "@/components/customer-dialog";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import type { Customer } from "@/lib/customers";

export function CustomersView({ customers, hasError, errorCode }: { customers: Customer[]; hasError: boolean; errorCode?: string }) {
  const { t } = useLanguage();
  return <PageShell><section>
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8"><div className="min-w-0"><p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm">{t("appName")}</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t("customers")}</h1><p className="mt-2 hidden text-slate-500 sm:block">{t("customersDescription")}</p></div><CustomerDialog /></div>
    {hasError || errorCode ? <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{hasError ? t("customersUnavailable") : errorCode === "duplicate" ? t("customerNameDuplicate") : t("customerOperationFailed")}</div> : null}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-900">{t("allCustomers")}</h2><p className="mt-1 text-xs text-slate-500 sm:text-sm">{t("allCustomersDescription")}</p></div><span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{t("customerCount", { count: String(customers.length) })}</span></header>
      {!hasError && customers.length === 0 ? <div className="grid min-h-64 place-items-center p-6 text-center"><div><UsersRound className="mx-auto text-slate-300" size={38} /><p className="mt-4 font-semibold text-slate-900">{t("noCustomers")}</p><p className="mt-1 text-sm text-slate-500">{t("noCustomersDescription")}</p></div></div> : null}
      {customers.length ? <div className="divide-y divide-slate-200">{customers.map((customer) => <article key={customer.id} className="flex items-center gap-3 px-4 py-4 sm:px-6"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><UserRound size={19} /></span><h3 className="min-w-0 flex-1 truncate font-semibold text-slate-900">{customer.name}</h3><div className="flex items-center sm:gap-2"><CustomerDialog customer={customer} /><CustomerDeleteButton customerId={customer.id} /></div></article>)}</div> : null}
    </div>
  </section></PageShell>;
}

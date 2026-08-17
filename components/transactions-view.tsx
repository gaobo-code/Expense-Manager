"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, CreditCard, Landmark, Plus, WalletCards } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TransactionDialog } from "@/components/transaction-dialog";
import { useLanguage } from "@/components/language-provider";
import { getCategoryName, type Category } from "@/lib/categories";
import type { Customer } from "@/lib/customers";

export type AccountType = "credit_card" | "cash" | "bank";
export type Currency = "USD" | "CNY";
export type Transaction = {
  id: number; transaction_date: string; amount: number; category: string;
  category_id: number | null; account_type: AccountType; currency: Currency; customer_id: number | null;
  customers: { name: string } | null;
};

type SortKey = "date" | "category" | "account" | "customer" | "amount";
type SortDirection = "asc" | "desc";

export function TransactionsView({ transactions, categories, customers, hasError, errorCode }: { transactions: Transaction[]; categories: Category[]; customers: Customer[]; hasError: boolean; errorCode?: string }) {
  const { language, formatDate, t } = useLanguage();
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: "date", direction: "desc" });
  const zh = language === "zh";
  const labels = useMemo(() => zh ? { add: "添加交易", empty: "还没有交易", emptyHelp: "记录第一笔收入或支出。", account: "账户", customer: "客户", error: "交易保存失败，请检查填写内容后重试。", credit_card: "信用卡账户", cash: "现金", bank: "银行账户" } : { add: "Add transaction", empty: "No transactions yet", emptyHelp: "Record your first transaction.", account: "Account", customer: "Customer", error: "The transaction could not be saved. Check the form and try again.", credit_card: "Credit card", cash: "Cash", bank: "Bank account" }, [zh]);
  const icons = { credit_card: CreditCard, cash: WalletCards, bank: Landmark };
  const categoryNames = useMemo(() => new Map(categories.map((category) => [category.id, getCategoryName(category, language)])), [categories, language]);
  const sortedTransactions = useMemo(() => {
    const collator = new Intl.Collator(zh ? "zh-CN" : "en-US", { numeric: true, sensitivity: "base" });
    const valueFor = (transaction: Transaction) => {
      if (sort.key === "date") return transaction.transaction_date;
      if (sort.key === "category") return transaction.category_id ? categoryNames.get(transaction.category_id) ?? transaction.category : transaction.category;
      if (sort.key === "account") return labels[transaction.account_type];
      if (sort.key === "customer") return transaction.customers?.name ?? null;
      return transaction.amount;
    };

    return transactions.map((transaction, index) => ({ transaction, index })).sort((a, b) => {
      const left = valueFor(a.transaction);
      const right = valueFor(b.transaction);
      if (left === null) return right === null ? a.index - b.index : 1;
      if (right === null) return -1;
      const comparison = typeof left === "number" && typeof right === "number" ? left - right : collator.compare(String(left), String(right));
      return comparison === 0 ? a.index - b.index : comparison * (sort.direction === "asc" ? 1 : -1);
    }).map(({ transaction }) => transaction);
  }, [categoryNames, labels, sort, transactions, zh]);
  const changeSort = (key: SortKey) => setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));
  const renderSortHeader = (sortKey: SortKey, children: React.ReactNode, className: string) => {
    const active = sort.key === sortKey;
    const SortIcon = active ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
    return <th className={className} aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" onClick={() => changeSort(sortKey)} className="inline-flex items-center justify-center gap-1.5 rounded-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" title={zh ? "点击排序" : "Sort column"}>{children}<SortIcon size={14} className={active ? "text-emerald-600" : "text-slate-400"} aria-hidden="true" /></button></th>;
  };

  return <PageShell><section>
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0"><p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm">{t("appName")}</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t("transactions")}</h1><p className="mt-2 hidden text-slate-500 sm:block">{t("transactionsDescription")}</p></div>
      <TransactionDialog categories={categories} customers={customers} trigger={<><Plus size={18} />{labels.add}</>} />
    </div>
    {errorCode ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{labels.error}</div> : null}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {hasError ? <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">{t("unavailable")}</div> : null}
      {transactions.length === 0 && !hasError ? <div className="px-6 py-16 text-center"><div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><WalletCards /></div><p className="font-semibold">{labels.empty}</p><p className="mt-1 text-sm text-slate-500">{labels.emptyHelp}</p></div> :
      <div className="w-full overflow-hidden"><table className="w-full table-fixed border-collapse text-center"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500 md:text-xs md:tracking-wider"><tr>{renderSortHeader("date", t("date"), "w-[28%] px-2 py-3 md:w-auto md:px-5 md:py-4")}{renderSortHeader("category", t("category"), "w-[28%] px-2 py-3 md:w-auto md:px-5 md:py-4")}{renderSortHeader("account", labels.account, "hidden px-5 py-4 md:table-cell")}{renderSortHeader("customer", labels.customer, "hidden px-5 py-4 md:table-cell")}{renderSortHeader("amount", t("amount"), "w-[32%] px-2 py-3 md:w-auto md:px-5 md:py-4")}<th className="w-[12%] md:w-16" /></tr></thead><tbody className="divide-y divide-slate-100">
        {sortedTransactions.map((transaction) => { const Icon = icons[transaction.account_type] ?? WalletCards; const categoryName = transaction.category_id ? categoryNames.get(transaction.category_id) : null; return <tr key={transaction.id} className="hover:bg-slate-50"><td className="break-words px-2 py-4 text-xs font-medium text-slate-700 md:px-5 md:text-sm">{formatDate(`${transaction.transaction_date}T00:00:00Z`)}</td><td className="break-words px-2 py-4 md:px-5"><span className="inline-flex max-w-full break-words rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 md:px-3 md:text-sm">{categoryName ?? transaction.category}</span></td><td className="hidden px-5 py-4 text-sm text-slate-600 md:table-cell"><span className="inline-flex items-center gap-2"><Icon size={16}/>{labels[transaction.account_type]}</span></td><td className="hidden px-5 py-4 text-sm text-slate-600 md:table-cell">{transaction.customers?.name ?? "—"}</td><td className="break-words px-2 py-4 text-xs font-semibold tabular-nums md:px-5 md:text-sm">{new Intl.NumberFormat(zh ? "zh-CN" : "en-US", { style: "currency", currency: transaction.currency }).format(transaction.amount)}</td><td className="pr-1 md:pr-3"><TransactionDialog transaction={transaction} categories={categories} customers={customers} /></td></tr>; })}
      </tbody></table></div>}
    </div>
  </section></PageShell>;
}

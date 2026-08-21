"use client";

import { useMemo, useState } from "react";
import { BarChart3, PieChart } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import type { Currency, Transaction } from "@/components/transactions-view";
import type { Category } from "@/lib/categories";

const currencies: Currency[] = ["USD", "CNY"];
type PeriodKey = "currentMonth" | "previousMonth" | "currentYear";
type PeriodValue = { key: PeriodKey; label: string; income: number; expense: number; net: number };

export function AnalysisView({ transactions, categories, hasError }: { transactions: Transaction[]; categories: Category[]; hasError: boolean }) {
  const { language, t } = useLanguage();
  const zh = language === "zh";
  const [currency, setCurrency] = useState<Currency>(() => language === "zh" ? "CNY" : "USD");
  const labels = zh ? {
    title: "收支分析", description: "统计本月、上个月和本年的收入与支出。", income: "收入", expense: "支出", net: "结余", currentMonth: "本月", previousMonth: "上个月", currentYear: "本年", comparison: "周期收支对比", comparisonHint: "各周期独立统计，不进行币种换算", noData: "暂无可分析的交易", noDataHint: "添加交易后，这里会自动生成图表。", unavailable: "暂时无法获取分析数据，请稍后重试。",
  } : {
    title: "Analysis", description: "Income and expenses for this month, last month, and this year.", income: "Income", expense: "Expenses", net: "Net", currentMonth: "This month", previousMonth: "Last month", currentYear: "This year", comparison: "Income and expense comparison", comparisonHint: "Each period is calculated independently; currencies are not converted", noData: "No transactions to analyze", noDataHint: "Add transactions and charts will appear here automatically.", unavailable: "Analysis data is temporarily unavailable. Please try again.",
  };
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const periods = useMemo<PeriodValue[]>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const currentMonthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const nextMonthStart = month === 11 ? `${year + 1}-01-01` : `${year}-${String(month + 2).padStart(2, "0")}-01`;
    const previousDate = new Date(year, month - 1, 1);
    const previousMonthStart = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, "0")}-01`;
    const result: PeriodValue[] = [
      { key: "currentMonth", label: labels.currentMonth, income: 0, expense: 0, net: 0 },
      { key: "previousMonth", label: labels.previousMonth, income: 0, expense: 0, net: 0 },
      { key: "currentYear", label: labels.currentYear, income: 0, expense: 0, net: 0 },
    ];
    const isIncome = (transaction: Transaction) => {
      let category = transaction.category_id ? categoryMap.get(transaction.category_id) : undefined;
      const visited = new Set<number>();
      while (category?.parent_id && !visited.has(category.id)) { visited.add(category.id); category = categoryMap.get(category.parent_id) ?? category; }
      return /收入|(^|\s)income(\s|$)/i.test((category ? `${category.name_zh} ${category.name_en}` : transaction.category).trim());
    };
    for (const transaction of transactions) {
      if (transaction.currency !== currency) continue;
      const date = transaction.transaction_date;
      const targets: PeriodValue[] = [];
      if (date >= currentMonthStart && date < nextMonthStart) targets.push(result[0]);
      if (date >= previousMonthStart && date < currentMonthStart) targets.push(result[1]);
      if (date >= `${year}-01-01` && date < `${year + 1}-01-01`) targets.push(result[2]);
      for (const target of targets) isIncome(transaction) ? target.income += transaction.amount : target.expense += transaction.amount;
    }
    result.forEach((period) => { period.net = period.income - period.expense; });
    return result;
  }, [categoryMap, currency, labels.currentMonth, labels.currentYear, labels.previousMonth, transactions]);

  const money = (value: number) => new Intl.NumberFormat(zh ? "zh-CN" : "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(value);
  const hasData = periods.some((period) => period.income || period.expense);

  return <PageShell><section className="-my-2 pb-4 md:my-0 md:py-2">
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8"><div><p className="mb-1.5 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">{t("appName")}</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">{labels.title}</h1><p className="mt-2 hidden text-slate-500 sm:block">{labels.description}</p></div><div className="flex rounded-xl bg-slate-100 p-1" aria-label={zh ? "选择币种" : "Choose currency"}>{currencies.map((item) => <button key={item} type="button" onClick={() => setCurrency(item)} className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 ${currency === item ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{item}</button>)}</div></div>
    {hasError ? <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{labels.unavailable}</div> : null}
    {!hasData && !hasError ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><BarChart3 /></span><p className="font-semibold">{labels.noData}</p><p className="mt-1 text-sm text-slate-500">{labels.noDataHint}</p></div> : <>
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-7 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><BarChart3 size={18} /></span><div><h2 className="font-bold text-slate-950">{labels.comparison}</h2><p className="text-xs text-slate-500">{labels.comparisonHint}</p></div></div><ComparisonChart periods={periods} labels={labels} money={money} /></article>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">{periods.map((period) => <PieChartCard key={period.key} period={period} labels={labels} money={money} />)}</div>
    </>}
  </section></PageShell>;
}

function ComparisonChart({ periods, labels, money }: { periods: PeriodValue[]; labels: { income: string; expense: string }; money: (value: number) => string }) {
  const max = Math.max(...periods.flatMap((period) => [period.income, period.expense]), 1);
  return <div><div className="mb-5 flex justify-end gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-emerald-500" />{labels.income}</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-rose-400" />{labels.expense}</span></div><div className="relative mb-7 flex h-80 items-end justify-around gap-5 border-b border-slate-200 px-2 pt-5 sm:mb-0 sm:h-72 sm:px-10"><div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100" /><div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100" /><div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-100" />{periods.map((period) => <div key={period.key} className="relative z-10 flex h-full flex-1 items-end justify-center gap-2 sm:gap-4"><Column value={period.income} max={max} color="bg-emerald-500" label={`${labels.income}: ${money(period.income)}`} /><Column value={period.expense} max={max} color="bg-rose-400" label={`${labels.expense}: ${money(period.expense)}`} /><span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-600 sm:text-sm">{period.label}</span></div>)}</div></div>;
}

function Column({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const displayValue = label.slice(label.indexOf(":") + 1).trim();
  return <div className={`relative w-7 rounded-t-lg shadow-sm transition-all duration-500 sm:w-12 ${color}`} style={{ height: value ? `${Math.max(value / max * 100, 2)}%` : "2px" }} title={label}><span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold tabular-nums text-slate-600 sm:text-xs">{displayValue}</span><span className="sr-only">{label}</span></div>;
}

function PieChartCard({ period, labels, money }: { period: PeriodValue; labels: { income: string; expense: string; net: string }; money: (value: number) => string }) {
  const total = period.income + period.expense;
  const incomeShare = total ? period.income / total * 100 : 0;
  const background = total ? `conic-gradient(#10b981 0 ${incomeShare}%, #fb7185 ${incomeShare}% 100%)` : "#e2e8f0";
  return <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-2.5"><PieChart size={18} className="text-slate-500" /><h2 className="text-lg font-bold">{period.label}</h2></div><div className="flex items-center gap-5"><div className="relative size-32 shrink-0 rounded-full" style={{ background }}><div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center"><div><p className="text-[10px] font-medium text-slate-400">{labels.net}</p><p className={`max-w-20 truncate text-sm font-bold ${period.net >= 0 ? "text-emerald-700" : "text-rose-600"}`} title={money(period.net)}>{money(period.net)}</p></div></div></div><div className="min-w-0 flex-1 space-y-4"><Legend color="bg-emerald-500" label={labels.income} value={money(period.income)} /><Legend color="bg-rose-400" label={labels.expense} value={money(period.expense)} /></div></div></article>;
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) { return <div className="min-w-0"><p className="flex items-center gap-2 text-xs text-slate-500"><i className={`size-2.5 rounded-full ${color}`} />{label}</p><p className="mt-1 truncate font-bold tabular-nums" title={value}>{value}</p></div>; }

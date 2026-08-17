"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CreditCard, Landmark, WalletCards } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import type { AccountType, Currency, Transaction } from "@/components/transactions-view";
import { useLanguage } from "@/components/language-provider";
import type { Category } from "@/lib/categories";

const accountTypes: AccountType[] = ["credit_card", "cash", "bank"];
const currencies: Currency[] = ["CNY", "USD"];
const icons = { credit_card: CreditCard, cash: WalletCards, bank: Landmark };
const cardStyles = {
  credit_card: "from-violet-50 to-white text-violet-700 ring-violet-100",
  cash: "from-emerald-50 to-white text-emerald-700 ring-emerald-100",
  bank: "from-sky-50 to-white text-sky-700 ring-sky-100",
};

function todayInLocalTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function AccountBalancesView({ transactions, categories, hasError }: { transactions: Transaction[]; categories: Category[]; hasError: boolean }) {
  const { language, t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(todayInLocalTime);
  const zh = language === "zh";
  const labels = zh
    ? { title: "账户余额", description: "查看指定日期结束时的各账户余额。", asOf: "余额日期", total: "合计余额", credit_card: "信用卡账户", cash: "现金", bank: "银行账户", unavailable: "暂时无法获取账户余额，请稍后重试。", note: "余额根据该日期及之前的交易计算" }
    : { title: "Account balances", description: "View each account balance at the end of a selected date.", asOf: "Balance date", total: "Total balance", credit_card: "Credit card", cash: "Cash", bank: "Bank account", unavailable: "Account balances are temporarily unavailable. Please try again.", note: "Balances include transactions on and before this date" };
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const balances = useMemo(() => {
    const result = Object.fromEntries(accountTypes.map((type) => [type, { CNY: 0, USD: 0 }])) as Record<AccountType, Record<Currency, number>>;
    const isIncome = (transaction: Transaction) => {
      let category = transaction.category_id ? categoryMap.get(transaction.category_id) : undefined;
      const visited = new Set<number>();
      while (category?.parent_id && !visited.has(category.id)) {
        visited.add(category.id);
        category = categoryMap.get(category.parent_id) ?? category;
      }
      const names = category ? `${category.name_zh} ${category.name_en}` : transaction.category;
      return /收入|(^|\s)income(\s|$)/i.test(names.trim());
    };
    for (const transaction of transactions) {
      if (transaction.transaction_date <= selectedDate) result[transaction.account_type][transaction.currency] += transaction.amount * (isIncome(transaction) ? 1 : -1);
    }
    return result;
  }, [categoryMap, selectedDate, transactions]);

  const totals = useMemo(() => ({
    CNY: accountTypes.reduce((sum, type) => sum + balances[type].CNY, 0),
    USD: accountTypes.reduce((sum, type) => sum + balances[type].USD, 0),
  }), [balances]);
  const formatMoney = (amount: number, currency: Currency) => new Intl.NumberFormat(zh ? "zh-CN" : "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount);

  return <PageShell><section className="-my-5 md:my-0 md:py-2">
    <div className="mb-3.5 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
      <div className="max-w-xl"><p className="mb-1.5 hidden text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:block sm:text-sm">{t("appName")}</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">{labels.title}</h1><p className="mt-2 hidden text-sm leading-6 text-slate-500 sm:block sm:text-base">{labels.description}</p></div>
      <div className="relative flex w-full items-stretch rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-white to-white shadow-[0_8px_24px_-16px_rgba(5,150,105,0.65)] sm:w-auto sm:border-slate-200 sm:bg-white sm:bg-none sm:shadow-sm">
        <div className="min-w-0 flex-1 px-3.5 py-2.5 sm:block sm:flex-none sm:px-4"><span className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:text-xs sm:font-semibold sm:normal-case sm:tracking-normal sm:text-slate-500"><span className="grid size-6 place-items-center rounded-lg bg-emerald-100 ring-1 ring-emerald-200/60 sm:contents sm:ring-0"><CalendarDays size={13} className="sm:size-3.5" /></span>{labels.asOf}</span><CalendarPicker value={selectedDate} onChange={setSelectedDate} language={language} /></div>
        <div className="grid w-12 overflow-hidden rounded-r-2xl border-l border-emerald-100 bg-white/60 sm:w-11 sm:border-slate-200 sm:bg-transparent">
          <button type="button" onClick={() => setSelectedDate((date) => shiftDate(date, 1))} className="grid min-h-8 place-items-center border-b border-emerald-100 text-slate-500 transition active:bg-emerald-100 sm:border-slate-200 sm:hover:bg-slate-50 sm:hover:text-emerald-700" aria-label={zh ? "后一天" : "Next day"} title={zh ? "后一天" : "Next day"}><ChevronUp size={16} /></button>
          <button type="button" onClick={() => setSelectedDate((date) => shiftDate(date, -1))} className="grid min-h-8 place-items-center text-slate-500 transition active:bg-emerald-100 sm:hover:bg-slate-50 sm:hover:text-emerald-700" aria-label={zh ? "前一天" : "Previous day"} title={zh ? "前一天" : "Previous day"}><ChevronDown size={16} /></button>
        </div>
      </div>
    </div>
    {hasError ? <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{labels.unavailable}</div> : null}
    <div className="grid gap-1.5 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-3 md:gap-5 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none lg:gap-6">{accountTypes.map((type) => { const Icon = icons[type]; return <article key={type} className={`group rounded-2xl bg-gradient-to-br p-3 shadow-none ring-0 transition duration-200 sm:p-5 sm:shadow-sm sm:ring-1 md:flex md:min-h-56 md:flex-col md:rounded-3xl md:p-6 md:hover:-translate-y-0.5 md:hover:shadow-md ${cardStyles[type]}`}><div className="mb-2.5 flex items-center gap-2.5 sm:mb-7 sm:gap-3 md:mb-auto"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/90 shadow-sm ring-1 ring-black/[0.03] sm:size-10 md:size-12 md:rounded-2xl"><Icon size={18} className="md:size-6" /></span><h2 className="text-sm font-semibold leading-tight text-slate-900 sm:text-base md:text-lg">{labels[type]}</h2></div><div className="grid min-w-0 grid-cols-2 gap-3 text-left md:mt-8 md:w-full">{currencies.map((currency) => <div key={currency} className="min-w-0 md:rounded-2xl md:bg-white/65 md:p-3 md:ring-1 md:ring-white/80"><span className="block text-[9px] font-bold tracking-[0.08em] text-slate-400 sm:text-xs sm:font-semibold sm:tracking-wide">{currency}</span><span className="block truncate text-base font-bold tabular-nums text-slate-900 sm:text-lg md:mt-1 md:text-xl" title={formatMoney(balances[type][currency], currency)}>{formatMoney(balances[type][currency], currency)}</span></div>)}</div></article>; })}</div>
    <div className="mt-2.5 overflow-hidden rounded-2xl bg-slate-950 p-3.5 text-white shadow-lg sm:mt-6 sm:rounded-3xl sm:p-8 md:ring-1 md:ring-slate-800"><div className="flex items-center justify-between gap-3"><div className="shrink-0"><p className="text-base font-bold text-slate-300 sm:text-lg md:text-xl">{labels.total}</p></div><div className="grid min-w-0 flex-1 grid-cols-2 gap-2 text-right sm:ml-auto sm:flex sm:flex-none sm:gap-8 md:mr-12 md:gap-12">{currencies.map((currency) => <div key={currency} className="min-w-0 md:border-l md:border-slate-800 md:pl-12"><span className="block text-[9px] font-medium tracking-wide text-slate-500 md:text-xs">{currency}</span><span className="block truncate text-base font-bold tabular-nums sm:text-3xl md:mt-1 md:text-4xl" title={formatMoney(totals[currency], currency)}>{formatMoney(totals[currency], currency)}</span></div>)}</div></div></div>
    <p className="mt-1.5 text-center text-[9px] text-slate-400 sm:mt-4 sm:text-xs">{labels.note}</p>
  </section></PageShell>;
}

function CalendarPicker({ value, onChange, language }: { value: string; onChange: (value: string) => void; language: "zh" | "en" }) {
  const [open, setOpen] = useState(false);
  const selected = parseLocalDate(value);
  const [month, setMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const rootRef = useRef<HTMLDivElement>(null);
  const zh = language === "zh";

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const previousCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  const weekdays = zh ? ["日", "一", "二", "三", "四", "五", "六"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells = Array.from({ length: 42 }, (_, index) => {
    const offset = index - firstDay + 1;
    if (offset < 1) return { day: previousCount + offset, delta: -1 };
    if (offset > dayCount) return { day: offset - dayCount, delta: 1 };
    return { day: offset, delta: 0 };
  });
  const choose = (day: number, delta: number) => {
    const date = new Date(month.getFullYear(), month.getMonth() + delta, day);
    onChange(toLocalDateValue(date));
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpen(false);
  };

  return <div ref={rootRef}>
    <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="dialog" aria-expanded={open} className="flex w-full items-center justify-between gap-2 bg-transparent text-left font-bold tabular-nums text-slate-950 outline-none sm:block sm:w-40 sm:text-sm sm:font-semibold"><span className="text-[15px] sm:hidden">{new Intl.DateTimeFormat(zh ? "zh-CN" : "en-US", { year: "numeric", month: "short", day: "numeric", weekday: "short" }).format(selected)}</span><span className="hidden sm:inline">{value}</span><ChevronRight size={15} className={`shrink-0 text-emerald-600 transition-transform sm:hidden ${open ? "rotate-90" : ""}`} /></button>
    {open ? <div role="dialog" aria-label={zh ? "选择日期" : "Choose date"} className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[300px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:w-[320px]">
      <div className="mb-3 flex items-center justify-between"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label={zh ? "上个月" : "Previous month"}><ChevronLeft size={18} /></button><p className="font-semibold text-slate-900">{new Intl.DateTimeFormat(zh ? "zh-CN" : "en-US", { year: "numeric", month: "long" }).format(month)}</p><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label={zh ? "下个月" : "Next month"}><ChevronRight size={18} /></button></div>
      <div className="grid grid-cols-7 text-center">{weekdays.map((day) => <span key={day} className="py-2 text-xs font-semibold text-slate-400">{day}</span>)}{cells.map((cell, index) => { const date = new Date(month.getFullYear(), month.getMonth() + cell.delta, cell.day); const dateValue = toLocalDateValue(date); const isSelected = dateValue === value; const isToday = dateValue === todayInLocalTime(); return <button type="button" key={`${cell.delta}-${cell.day}-${index}`} onClick={() => choose(cell.day, cell.delta)} className={`mx-auto my-0.5 grid size-9 place-items-center rounded-full text-sm transition ${isSelected ? "bg-emerald-600 font-semibold text-white shadow-sm" : cell.delta !== 0 ? "text-slate-300 hover:bg-slate-50" : isToday ? "bg-emerald-50 font-semibold text-emerald-700 hover:bg-emerald-100" : "text-slate-700 hover:bg-slate-100"}`}>{cell.day}</button>; })}</div>
      <div className="mt-3 border-t border-slate-100 pt-3 text-center"><button type="button" onClick={() => { const current = new Date(); setMonth(new Date(current.getFullYear(), current.getMonth(), 1)); }} className="rounded-lg px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">{zh ? "当月" : "Current month"}</button></div>
    </div> : null}
  </div>;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

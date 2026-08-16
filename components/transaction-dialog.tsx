"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Eye, Pencil, Plus, X } from "lucide-react";
import { createQuickCategory, createQuickCustomer, createTransaction, updateTransaction } from "@/app/actions";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryName, type Category } from "@/lib/categories";
import type { Customer } from "@/lib/customers";
import type { Transaction } from "@/components/transactions-view";

const selectClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30";
type QuickKind = "category" | "customer";

export function TransactionDialog({ transaction, categories, customers, trigger }: { transaction?: Transaction; categories: Category[]; customers: Customer[]; trigger?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [quickKind, setQuickKind] = useState<QuickKind | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);
  const [localCustomers, setLocalCustomers] = useState(customers);
  const [categoryId, setCategoryId] = useState(String(transaction?.category_id ?? ""));
  const [customerId, setCustomerId] = useState(String(transaction?.customer_id ?? ""));
  const { language } = useLanguage();
  const zh = language === "zh";
  const editing = Boolean(transaction);
  const today = new Date().toLocaleDateString("en-CA");
  const l = zh ? {
    add: "添加交易", edit: "编辑交易", detail: "查看交易详情", hint: "填写交易信息，带 * 的项目为必填项。", date: "日期", category: "类别", chooseCategory: "选择类别", addCategory: "添加新类别", chineseName: "中文名称", englishName: "英文名称", parentCategory: "所属一级类别", noParent: "无，创建一级类别", categoryRequired: "中文名称和英文名称至少填写一个。", account: "账户", credit: "信用卡账户", cash: "现金", bank: "银行账户", amount: "金额", currency: "货币", customer: "关联客户", noCustomer: "不关联客户", addCustomer: "添加新客户", customerName: "客户名称", cancel: "取消", save: "保存修改", create: "确认添加", close: "关闭", quickHint: "添加后将立即保存并自动选中。", adding: "正在添加…", confirm: "添加", failed: "添加失败，请检查填写内容后重试。",
  } : {
    add: "Add transaction", edit: "Edit transaction", detail: "View transaction details", hint: "Enter the transaction details. Fields marked * are required.", date: "Date", category: "Category", chooseCategory: "Choose a category", addCategory: "Add new category", chineseName: "Chinese name", englishName: "English name", parentCategory: "Parent category", noParent: "None — create a top-level category", categoryRequired: "Enter at least a Chinese or English name.", account: "Account", credit: "Credit card", cash: "Cash", bank: "Bank account", amount: "Amount", currency: "Currency", customer: "Customer", noCustomer: "No customer", addCustomer: "Add new customer", customerName: "Customer name", cancel: "Cancel", save: "Save changes", create: "Add transaction", close: "Close", quickHint: "It will be saved immediately and selected automatically.", adding: "Adding…", confirm: "Add", failed: "Could not add it. Check the form and try again.",
  };

  useEffect(() => { if (!open) return; const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }, [open]);
  const show = () => { setCategoryId(String(transaction?.category_id ?? "")); setCustomerId(String(transaction?.customer_id ?? "")); setOpen(true); };

  return <>
    {trigger ? <Button type="button" onClick={show} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700">{trigger}</Button> : <Button type="button" variant="ghost" size="icon" onClick={show} className="size-8 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 md:size-9" aria-label={l.detail}><Eye className="md:hidden" size={15}/><Pencil className="hidden md:block" size={15}/></Button>}
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center text-left font-sans text-slate-950 sm:items-center sm:p-6"><button type="button" aria-label={l.close} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"/><div role="dialog" aria-modal="true" aria-labelledby="transaction-title" className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="transaction-title" className="text-xl font-bold">{editing ? l.edit : l.add}</h2><p className="mt-1 text-sm text-slate-500">{l.hint}</p></div><button type="button" aria-label={l.close} onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18}/></button></div>
      <form action={editing ? updateTransaction : createTransaction} className="space-y-5">
        {transaction ? <input type="hidden" name="transactionId" value={transaction.id}/> : null}
        <Field label={`${l.date} *`}><DatePicker name="date" defaultValue={transaction?.transaction_date ?? today} language={language}/></Field>
        <Field label={`${l.category} *`}><div className="flex gap-2"><select name="categoryId" required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={selectClass}><option value="" disabled>{l.chooseCategory}</option>{localCategories.map((category) => <option key={category.id} value={category.id}>{getCategoryName(category, language)}</option>)}</select><Button type="button" variant="outline" onClick={() => setQuickKind("category")} className="h-11 shrink-0 rounded-xl px-3"><Plus size={16}/><span className="hidden sm:inline">{l.addCategory}</span></Button></div></Field>
        <div className="grid gap-4 sm:grid-cols-2"><Field label={`${l.account} *`}><select name="accountType" required defaultValue={transaction?.account_type ?? "cash"} className={selectClass}><option value="credit_card">{l.credit}</option><option value="cash">{l.cash}</option><option value="bank">{l.bank}</option></select></Field><Field label={`${l.currency} *`}><select name="currency" required defaultValue={transaction?.currency ?? "CNY"} className={selectClass}><option value="CNY">CNY · 人民币</option><option value="USD">USD · 美元</option></select></Field></div>
        <Field label={`${l.amount} *`}><Input type="number" name="amount" required min="0" max="9999999999.99" step="0.01" inputMode="decimal" defaultValue={transaction?.amount} placeholder="0.00" className="h-12 rounded-xl text-lg font-semibold tabular-nums"/></Field>
        <Field label={l.customer}><div className="flex gap-2"><select name="customerId" value={customerId} onChange={(event) => setCustomerId(event.target.value)} className={selectClass}><option value="">{l.noCustomer}</option>{localCustomers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select><Button type="button" variant="outline" onClick={() => setQuickKind("customer")} className="h-11 shrink-0 rounded-xl px-3"><Plus size={16}/><span className="hidden sm:inline">{l.addCustomer}</span></Button></div></Field>
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">{l.cancel}</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{editing ? l.save : l.create}</Button></div>
      </form>
    </div></div> : null}
    {quickKind ? <QuickCreateDialog kind={quickKind} labels={l} roots={localCategories.filter((item) => item.parent_id === null)} language={language} onClose={() => setQuickKind(null)} onCreated={(item) => {
      if (quickKind === "category") { setLocalCategories((items) => [...items, { id: item.id, parent_id: item.parentId ?? null, user_id: "local", name_zh: item.nameZh ?? "", name_en: item.nameEn ?? "", sort_order: 0, created_at: "", updated_at: "" }]); setCategoryId(String(item.id)); }
      else { setLocalCustomers((items) => [...items, { id: item.id, user_id: "local", name: item.name, created_at: "", updated_at: "" }]); setCustomerId(String(item.id)); }
      setQuickKind(null);
    }}/> : null}
  </>;
}

function QuickCreateDialog({ kind, labels, roots, language, onClose, onCreated }: { kind: QuickKind; labels: Record<string, string>; roots: Category[]; language: "zh" | "en"; onClose: () => void; onCreated: (item: { id: number; name: string; nameZh?: string; nameEn?: string; parentId?: number | null }) => void }) {
  const [name, setName] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const isCategory = kind === "category";
  const submit = () => { if (isCategory ? (!nameZh.trim() && !nameEn.trim()) : !name.trim()) { setError(true); return; } startTransition(async () => { const result = isCategory ? await createQuickCategory(nameZh, nameEn, parentId) : await createQuickCustomer(name); if (result.ok) onCreated(result); else setError(true); }); };
  return <div className="fixed inset-0 z-[60] flex items-end justify-center text-left font-sans text-slate-950 sm:items-center sm:p-6"><button type="button" aria-label={labels.close} onClick={onClose} className="absolute inset-0 bg-slate-950/55"/><div role="dialog" aria-modal="true" className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><div><h3 className="text-xl font-bold">{isCategory ? labels.addCategory : labels.addCustomer}</h3><p className="mt-1 text-sm text-slate-500">{labels.quickHint}</p></div><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-slate-100"><X size={18}/></button></div>{isCategory ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label={labels.chineseName}><Input autoFocus value={nameZh} onChange={(event) => { setNameZh(event.target.value); setError(false); }} maxLength={60} className="h-11 rounded-xl"/></Field><Field label={labels.englishName}><Input value={nameEn} onChange={(event) => { setNameEn(event.target.value); setError(false); }} maxLength={60} className="h-11 rounded-xl"/></Field></div><Field label={labels.parentCategory}><select value={parentId} onChange={(event) => setParentId(event.target.value)} className={selectClass}><option value="">{labels.noParent}</option>{roots.map((root) => <option key={root.id} value={root.id}>{getCategoryName(root, language)}</option>)}</select></Field>{error ? <p className="text-sm text-red-600">{!nameZh.trim() && !nameEn.trim() ? labels.categoryRequired : labels.failed}</p> : null}</div> : <Field label={`${labels.customerName} *`}><Input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(false); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); submit(); } }} maxLength={100} className="h-11 rounded-xl"/>{error ? <p className="mt-2 text-sm text-red-600">{labels.failed}</p> : null}</Field>}<div className="mt-6 flex gap-3"><Button type="button" variant="outline" disabled={pending} onClick={onClose} className="h-11 flex-1 rounded-xl">{labels.cancel}</Button><Button type="button" disabled={pending} onClick={submit} className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{pending ? labels.adding : labels.confirm}</Button></div></div></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }

function DatePicker({ name, defaultValue, language }: { name: string; defaultValue: string; language: "zh" | "en" }) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const initial = parseDate(defaultValue);
  const [month, setMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const rootRef = useRef<HTMLDivElement>(null);
  const locale = language === "zh" ? "zh-CN" : "en-US";

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = parseDate(value);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const previousCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  const weekdays = language === "zh" ? ["日", "一", "二", "三", "四", "五", "六"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells = Array.from({ length: 42 }, (_, index) => {
    const offset = index - firstDay + 1;
    if (offset < 1) return { day: previousCount + offset, delta: -1 };
    if (offset > dayCount) return { day: offset - dayCount, delta: 1 };
    return { day: offset, delta: 0 };
  });
  const choose = (day: number, delta: number) => {
    const date = new Date(month.getFullYear(), month.getMonth() + delta, day);
    chooseDate(date);
  };
  const chooseDate = (date: Date) => {
    setValue(toDateValue(date));
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpen(false);
  };

  return <div ref={rootRef} className="relative">
    <input type="hidden" name={name} value={value}/>
    <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="dialog" aria-expanded={open} className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left shadow-sm outline-none transition hover:border-emerald-300 hover:bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500/25">
      <span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><CalendarDays size={17}/></span><span className="font-medium text-slate-800">{new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(selected)}</span></span>
      <ChevronRight className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} size={17}/>
    </button>
    {open ? <div role="dialog" aria-label={language === "zh" ? "选择日期" : "Choose date"} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:w-[320px]">
      <div className="mb-3 flex items-center justify-between"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label={language === "zh" ? "上个月" : "Previous month"}><ChevronLeft size={18}/></button><p className="font-semibold text-slate-900">{new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(month)}</p><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label={language === "zh" ? "下个月" : "Next month"}><ChevronRight size={18}/></button></div>
      <div className="grid grid-cols-7 text-center">{weekdays.map((day) => <span key={day} className="py-2 text-xs font-semibold text-slate-400">{day}</span>)}{cells.map((cell, index) => { const date = new Date(month.getFullYear(), month.getMonth() + cell.delta, cell.day); const isSelected = toDateValue(date) === value; const isToday = toDateValue(date) === toDateValue(new Date()); return <button type="button" key={`${cell.delta}-${cell.day}-${index}`} onClick={() => choose(cell.day, cell.delta)} className={`mx-auto my-0.5 grid size-9 place-items-center rounded-full text-sm transition ${isSelected ? "bg-emerald-600 font-semibold text-white shadow-sm" : cell.delta !== 0 ? "text-slate-300 hover:bg-slate-50" : isToday ? "bg-emerald-50 font-semibold text-emerald-700 hover:bg-emerald-100" : "text-slate-700 hover:bg-slate-100"}`}>{cell.day}</button>; })}</div>
      <div className="mt-3 border-t border-slate-100 pt-3 text-center"><button type="button" onClick={() => { const current = new Date(); setMonth(new Date(current.getFullYear(), current.getMonth(), 1)); }} className="rounded-lg px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">{language === "zh" ? "当月" : "Current month"}</button></div>
    </div> : null}
  </div>;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

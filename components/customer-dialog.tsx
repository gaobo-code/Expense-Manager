"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { createCustomer, updateCustomer } from "@/app/customers/actions";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/lib/customers";

export function CustomerDialog({ customer }: { customer?: Pick<Customer, "id" | "name"> }) {
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const { t } = useLanguage();
  const editing = Boolean(customer);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  return <>
    {editing ? <Button type="button" variant="ghost" size="icon" onClick={() => { setNameError(false); setOpen(true); }} className="size-9 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700" aria-label={t("editCustomer")}><Pencil size={15} /></Button>
      : <Button type="button" onClick={() => { setNameError(false); setOpen(true); }} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus size={18} />{t("addCustomer")}</Button>}
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="customer-title" className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="customer-title" className="text-xl font-bold">{editing ? t("editCustomer") : t("addCustomer")}</h2><p className="mt-1 text-sm text-slate-500">{t("customerFormDescription")}</p></div><button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18} /></button></div>
        <form action={editing ? updateCustomer : createCustomer} className="space-y-5" onSubmit={(event) => {
          if (!String(new FormData(event.currentTarget).get("name") ?? "").trim()) { event.preventDefault(); setNameError(true); }
        }}>
          {customer ? <input type="hidden" name="customerId" value={customer.id} /> : null}
          <div className="space-y-2"><Label htmlFor={`customer-name-${customer?.id ?? "new"}`}>{t("customerName")}</Label><Input id={`customer-name-${customer?.id ?? "new"}`} name="name" autoFocus required maxLength={100} defaultValue={customer?.name} onChange={() => setNameError(false)} className={`h-11 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} placeholder={t("customerNamePlaceholder")} />{nameError ? <p role="alert" className="text-sm font-medium text-red-600">{t("customerNameRequired")}</p> : null}</div>
          <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">{t("cancel")}</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{editing ? t("saveChanges") : t("confirmAddCustomer")}</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}

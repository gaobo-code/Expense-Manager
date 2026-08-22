"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, Pencil, Plus, Trash2, X } from "lucide-react";
import { createCustomer, deleteCustomer, updateCustomer, type DeleteCustomerState } from "@/app/customers/actions";
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
  const [state, formAction, pending] = useActionState(editing ? updateCustomer : createCustomer, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  useEffect(() => {
    if (!state.success) return;
    setOpen(false);
    if (!editing) formRef.current?.reset();
  }, [editing, state]);

  return <>
    {editing ? <Button type="button" variant="ghost" size="icon" onClick={() => { setNameError(false); setOpen(true); }} className="size-9 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:text-slate-600 sm:shadow-sm sm:hover:border-emerald-200" aria-label={t("editCustomer")} title={t("editCustomer")}><Pencil size={15} /></Button>
      : <Button type="button" onClick={() => { setNameError(false); setOpen(true); }} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus size={18} />{t("addCustomer")}</Button>}
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="customer-title" className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="customer-title" className="text-xl font-bold">{editing ? t("editCustomer") : t("addCustomer")}</h2><p className="mt-1 text-sm text-slate-500">{t("customerFormDescription")}</p></div><button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18} /></button></div>
        <form ref={formRef} action={formAction} className="space-y-5" onSubmit={(event) => {
          if (!String(new FormData(event.currentTarget).get("name") ?? "").trim()) { event.preventDefault(); setNameError(true); }
        }}>
          {customer ? <input type="hidden" name="customerId" value={customer.id} /> : null}
          <div className="space-y-2"><Label htmlFor={`customer-name-${customer?.id ?? "new"}`}>{t("customerName")}</Label><Input id={`customer-name-${customer?.id ?? "new"}`} name="name" autoFocus required maxLength={100} defaultValue={customer?.name} onChange={() => setNameError(false)} className={`h-11 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} placeholder={t("customerNamePlaceholder")} />{nameError ? <p role="alert" className="text-sm font-medium text-red-600">{t("customerNameRequired")}</p> : null}</div>
          <div className="flex gap-3"><Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">{t("cancel")}</Button><Button type="submit" disabled={pending} className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{editing ? t("saveChanges") : t("confirmAddCustomer")}</Button></div>
        </form>
        {customer ? <div className="mt-3 sm:hidden"><CustomerDeleteButton customerId={customer.id} mobile disabled={pending} /></div> : null}
      </div>
    </div> : null}
  </>;
}

export function CustomerDeleteButton({ customerId, mobile = false, disabled = false }: { customerId: number; mobile?: boolean; disabled?: boolean }) {
  const { t } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCustomer, { success: false, error: null } satisfies DeleteCustomerState);
  const wasDeletePending = useRef(false);

  useEffect(() => {
    if (deletePending) { wasDeletePending.current = true; return; }
    if (!wasDeletePending.current) return;
    wasDeletePending.current = false;
    if (deleteState.success) { setConfirmOpen(false); return; }
    if (!deleteState.error) return;
    setConfirmOpen(false);
    setShowDeleteToast(true);
    const timer = window.setTimeout(() => setShowDeleteToast(false), 4500);
    return () => window.clearTimeout(timer);
  }, [deletePending, deleteState]);

  function openDeleteConfirmation() { setShowDeleteToast(false); setConfirmOpen(true); }

  return <>
    {mobile ? <Button type="button" variant="outline" disabled={disabled || deletePending} onClick={openDeleteConfirmation} className="h-11 w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} />{t("deleteCustomer")}</Button> : <Button type="button" variant="ghost" size="icon" disabled={deletePending} onClick={openDeleteConfirmation} className="hidden size-9 rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 sm:inline-flex" aria-label={t("deleteCustomer")} title={t("deleteCustomer")}><Trash2 size={15} /></Button>}

    {confirmOpen ? <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button type="button" className="absolute inset-0 bg-slate-950/40" aria-label={t("cancel")} onClick={() => setConfirmOpen(false)} />
      <div role="alertdialog" aria-modal="true" aria-labelledby={`delete-customer-title-${customerId}`} className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={`delete-customer-title-${customerId}`} className="text-lg font-bold text-slate-950">{t("deleteCustomerTitle")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{t("deleteCustomerConfirm")}</p>
        <form action={deleteAction} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="customerId" value={customerId} />
          <Button type="button" variant="ghost" disabled={deletePending} onClick={() => setConfirmOpen(false)} className="rounded-lg text-slate-600">{t("cancel")}</Button>
          <Button type="submit" disabled={deletePending} className="rounded-lg bg-red-600 px-5 text-white hover:bg-red-700">{deletePending ? t("deletingCustomer") : t("confirmDeleteCustomer")}</Button>
        </form>
      </div>
    </div> : null}

    {showDeleteToast && deleteState.error ? <div role="alert" aria-live="assertive" className="fixed left-4 right-4 top-4 z-[80] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-red-700 shadow-xl shadow-slate-900/10 sm:left-1/2 sm:right-auto sm:top-6 sm:mx-0 sm:w-full sm:-translate-x-1/2">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50"><CircleAlert size={19} /></span>
      <div className="min-w-0 flex-1"><p className="font-semibold">{t("customerDeleteFailedTitle")}</p><p className="mt-0.5 text-sm leading-5 text-slate-600">{deleteState.error === "in-use" ? t("customerInUse") : t("customerDeleteFailed")}</p></div>
      <button type="button" aria-label={t("close")} onClick={() => setShowDeleteToast(false)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
    </div> : null}
  </>;
}

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, Pencil, Plus, Trash2, X } from "lucide-react";
import { createUserCategory, deleteUserCategory, updateUserCategory, type DeleteCategoryState } from "@/app/categories/actions";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryName, type Category } from "@/lib/categories";

type EditableCategory = Pick<Category, "id" | "name_zh" | "name_en">;
type RootCategory = Pick<Category, "id" | "name_zh" | "name_en" | "amount_effect">;

export function UserCategoryDialog({ category, roots = [], compact = false }: { category?: EditableCategory; roots?: RootCategory[]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [parentId, setParentId] = useState("");
  const [amountEffect, setAmountEffect] = useState<"increase" | "decrease" | "">("");
  const { language, t } = useLanguage();
  const editing = Boolean(category);
  const selectedRoot = roots.find((root) => String(root.id) === parentId);
  const [state, formAction, pending] = useActionState(editing ? updateUserCategory : createUserCategory, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (selectedRoot) setAmountEffect(selectedRoot.amount_effect);
  }, [selectedRoot]);

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
  }, [editing, state.success]);

  return <>
    {editing ? (
      <Button type="button" variant="ghost" size="icon" onClick={() => { setNameError(false); setOpen(true); }} className={`${compact ? "size-7 rounded-full" : "size-9 rounded-lg"} text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 sm:size-9 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:text-slate-600 sm:shadow-sm sm:hover:border-emerald-200 sm:hover:bg-emerald-50 sm:hover:text-emerald-700`} aria-label={t("editCategory")} title={t("editCategory")}><Pencil size={compact ? 12 : 15} /></Button>
    ) : (
      <Button type="button" onClick={() => { setNameError(false); setParentId(""); setAmountEffect(""); setOpen(true); }} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus size={18} />{t("addCategory")}</Button>
    )}

    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="user-category-title" className="relative max-h-[calc(100%-1rem)] w-full scroll-pt-6 overflow-y-auto overscroll-y-contain rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-full sm:max-w-lg sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="user-category-title" className="text-xl font-bold">{editing ? t("editCategory") : t("addCategory")}</h2><p className="mt-1 text-sm text-slate-500">{t("categoryFormDescription")}</p></div>
          <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18} /></button>
        </div>
        <form ref={formRef} action={formAction} className="space-y-5" onSubmit={(event) => {
          const formData = new FormData(event.currentTarget);
          const nameZh = String(formData.get("nameZh") ?? "").trim();
          const nameEn = String(formData.get("nameEn") ?? "").trim();
          if (!nameZh && !nameEn) {
            event.preventDefault();
            setNameError(true);
          }
        }}>
          {category ? <input type="hidden" name="categoryId" value={category.id} /> : null}
          {language === "zh" ? <>
            <div className="space-y-2"><Label htmlFor={`user-name-zh-${category?.id ?? "new"}`}>{t("chineseName")}</Label><Input id={`user-name-zh-${category?.id ?? "new"}`} name="nameZh" className={`h-11 scroll-my-20 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} maxLength={60} autoFocus defaultValue={category?.name_zh} onChange={() => setNameError(false)} placeholder="例如：餐饮" /></div>
            {category ? <input type="hidden" name="nameEn" value={category.name_en} /> : null}
          </> : <>
            {category ? <input type="hidden" name="nameZh" value={category.name_zh} /> : null}
            <div className="space-y-2"><Label htmlFor={`user-name-en-${category?.id ?? "new"}`}>{t("englishName")}</Label><Input id={`user-name-en-${category?.id ?? "new"}`} name="nameEn" className={`h-11 scroll-my-20 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} maxLength={60} autoFocus defaultValue={category?.name_en} onChange={() => setNameError(false)} placeholder="e.g. Food" /></div>
          </>}
          {nameError ? <p role="alert" className="text-sm font-medium text-red-600">{t("categoryNameRequired")}</p> : null}
          {!editing ? <><div className="space-y-2"><Label htmlFor="user-parent-id">{t("parentCategory")}</Label><select id="user-parent-id" name="parentId" value={parentId} onChange={(event) => setParentId(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"><option value="">{t("createRootCategory")}</option>{roots.map((root) => <option key={root.id} value={root.id}>{getCategoryName(root, language)}</option>)}</select><p className="text-xs text-slate-500">{t("parentCategoryDescription")}</p></div><div className="space-y-2"><Label>{t("amountEffect")}</Label><div className="grid grid-cols-2 gap-3"><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="radio" name="amountEffect" value="increase" required checked={amountEffect === "increase"} onChange={() => setAmountEffect("increase")} />{t("amountIncrease")}</label><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="radio" name="amountEffect" value="decrease" required checked={amountEffect === "decrease"} onChange={() => setAmountEffect("decrease")} />{t("amountDecrease")}</label></div><p className="text-xs text-slate-500">{parentId ? (language === "zh" ? "已默认带入一级类别的选择，可以修改。" : "Defaults to the top-level category's choice and can be changed.") : t("amountEffectDescription")}</p></div></> : null}
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">{t("cancel")}</Button><Button type="submit" disabled={pending} className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{editing ? t("saveChanges") : t("confirmAdd")}</Button></div>
        </form>
        {category ? <div className="mt-3 sm:hidden"><UserCategoryDeleteButton categoryId={category.id} mobile disabled={pending} /></div> : null}
      </div>
    </div> : null}
  </>;
}

export function UserCategoryDeleteButton({ categoryId, compact = false, mobile = false, disabled = false }: { categoryId: number; compact?: boolean; mobile?: boolean; disabled?: boolean }) {
  const { t } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUserCategory, { success: false, error: null } satisfies DeleteCategoryState);
  const wasDeletePending = useRef(false);

  useEffect(() => {
    if (deletePending) {
      wasDeletePending.current = true;
      return;
    }
    if (!wasDeletePending.current) return;
    wasDeletePending.current = false;
    if (deleteState.success) {
      setConfirmOpen(false);
      return;
    }
    if (!deleteState.error) return;
    setConfirmOpen(false);
    setShowDeleteToast(true);
    const timer = window.setTimeout(() => setShowDeleteToast(false), 4500);
    return () => window.clearTimeout(timer);
  }, [deletePending, deleteState]);

  function openDeleteConfirmation() {
    setShowDeleteToast(false);
    setConfirmOpen(true);
  }

  return <>
    {mobile ? <Button type="button" variant="outline" disabled={disabled || deletePending} onClick={openDeleteConfirmation} className="h-11 w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} />{t("deleteCategory")}</Button> : <Button type="button" variant="ghost" size="icon" disabled={deletePending} onClick={openDeleteConfirmation} className="hidden size-9 rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 sm:inline-flex" aria-label={t("deleteCategory")} title={t("deleteCategory")}><Trash2 size={compact ? 12 : 15} /></Button>}

    {confirmOpen ? <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button type="button" className="absolute inset-0 bg-slate-950/40" aria-label={t("cancel")} onClick={() => setConfirmOpen(false)} />
      <div role="alertdialog" aria-modal="true" aria-labelledby={`delete-category-title-${categoryId}`} className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={`delete-category-title-${categoryId}`} className="text-lg font-bold text-slate-950">{t("deleteCategoryTitle")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{t("deleteCategoryConfirm")}</p>
        <form action={deleteAction} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="categoryId" value={categoryId} />
          <Button type="button" variant="ghost" disabled={deletePending} onClick={() => setConfirmOpen(false)} className="rounded-lg text-slate-600">{t("cancel")}</Button>
          <Button type="submit" disabled={deletePending} className="rounded-lg bg-red-600 px-5 text-white hover:bg-red-700">{deletePending ? t("deletingCategory") : t("confirmDeleteCategory")}</Button>
        </form>
      </div>
    </div> : null}

    {showDeleteToast && deleteState.error ? <div role="alert" aria-live="assertive" className="fixed left-4 right-4 top-4 z-[80] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-red-700 shadow-xl shadow-slate-900/10 sm:left-1/2 sm:right-auto sm:top-6 sm:mx-0 sm:w-full sm:-translate-x-1/2">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50"><CircleAlert size={19} /></span>
      <div className="min-w-0 flex-1"><p className="font-semibold">{t("categoryDeleteFailedTitle")}</p><p className="mt-0.5 text-sm leading-5 text-slate-600">{deleteState.error === "in-use" ? t("categoryInUse") : t("categoryDeleteFailed")}</p></div>
      <button type="button" aria-label={t("close")} onClick={() => setShowDeleteToast(false)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
    </div> : null}
  </>;
}

"use client";

import { deleteCommonCategory, type DeleteCommonCategoryState } from "@/app/admin/(console)/categories/actions";
import { Button } from "@/components/ui/button";
import { CircleAlert, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

export function AdminCategoryDeleteButton({ categoryId, categoryName }: { categoryId: number; categoryName: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [state, action, pending] = useActionState(deleteCommonCategory, { success: false, error: null } satisfies DeleteCommonCategoryState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) { wasPending.current = true; return; }
    if (!wasPending.current) return;
    wasPending.current = false;
    if (state.success) { setConfirmOpen(false); return; }
    if (!state.error) return;
    setConfirmOpen(false);
    setShowToast(true);
    const timer = window.setTimeout(() => setShowToast(false), 4500);
    return () => window.clearTimeout(timer);
  }, [pending, state]);

  return <>
    <Button type="button" variant="outline" size="icon" onClick={() => { setShowToast(false); setConfirmOpen(true); }} className="size-9 rounded-lg border-red-100 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700" aria-label={`删除类别 ${categoryName}`} title={`删除 ${categoryName}`}><Trash2 size={14}/></Button>

    {confirmOpen ? <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button type="button" aria-label="取消删除" onClick={() => setConfirmOpen(false)} className="absolute inset-0 bg-slate-950/40" />
      <div role="alertdialog" aria-modal="true" aria-labelledby={`delete-admin-category-${categoryId}`} className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={`delete-admin-category-${categoryId}`} className="text-lg font-bold text-slate-950">删除这个类别？</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">只有尚未被交易使用的类别才能删除。删除一级类别时，其下未使用的子类别也会一并删除。</p>
        <form action={action} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="categoryId" value={categoryId}/>
          <Button type="button" variant="ghost" disabled={pending} onClick={() => setConfirmOpen(false)} className="rounded-lg text-slate-600">取消</Button>
          <Button type="submit" disabled={pending} className="rounded-lg bg-red-600 px-5 text-white hover:bg-red-700">{pending ? "正在删除…" : "删除"}</Button>
        </form>
      </div>
    </div> : null}

    {showToast && state.error ? <div role="alert" aria-live="assertive" className="fixed left-4 right-4 top-4 z-[80] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-red-700 shadow-xl shadow-slate-900/10 sm:left-1/2 sm:right-auto sm:top-6 sm:mx-0 sm:w-full sm:-translate-x-1/2">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50"><CircleAlert size={19}/></span>
      <div className="min-w-0 flex-1"><p className="font-semibold">无法删除类别</p><p className="mt-0.5 text-sm leading-5 text-slate-600">{state.error === "in-use" ? "该类别或其子类别已被交易使用，无法删除。" : "类别删除失败，请稍后重试。"}</p></div>
      <button type="button" aria-label="关闭" onClick={() => setShowToast(false)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={16}/></button>
    </div> : null}
  </>;
}

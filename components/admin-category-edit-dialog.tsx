"use client";

import { updateCommonCategory } from "@/app/admin/(console)/categories/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

type EditableCategory = { id: number; name_zh: string; name_en: string };

export function AdminCategoryEditDialog({ category }: { category: EditableCategory }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateCommonCategory, { success: false });

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return <>
    <Button type="button" variant="outline" size="icon" onClick={() => setOpen(true)} className="size-9 rounded-lg" aria-label={`编辑类别 ${category.name_zh}`} title={`编辑 ${category.name_zh}`}>
      <Pencil size={14} />
    </Button>
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="关闭编辑类别窗口" onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby={`edit-category-${category.id}`} className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id={`edit-category-${category.id}`} className="text-xl font-bold">编辑类别名称</h2><p className="mt-1 text-sm text-slate-500">修改中文名称和英文名称，不会改变类别层级。</p></div>
          <button type="button" aria-label="关闭" onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18}/></button>
        </div>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="categoryId" value={category.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor={`nameZh-${category.id}`}>中文名称</Label><Input className="h-11 rounded-xl" id={`nameZh-${category.id}`} name="nameZh" required maxLength={60} autoFocus defaultValue={category.name_zh}/></div>
            <div className="space-y-2"><Label htmlFor={`nameEn-${category.id}`}>英文名称</Label><Input className="h-11 rounded-xl" id={`nameEn-${category.id}`} name="nameEn" required maxLength={60} defaultValue={category.name_en}/></div>
          </div>
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">取消</Button><Button type="submit" disabled={pending} className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">保存修改</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}

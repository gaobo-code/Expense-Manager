"use client";

import { createCommonCategory } from "@/app/admin/(console)/categories/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type RootCategory = { id: number; name_zh: string; name_en: string };

export function AdminCategoryCreateDialog({ roots }: { roots: RootCategory[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return <>
    <Button onClick={() => setOpen(true)} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus />添加类别</Button>
    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="关闭添加类别窗口" onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="category-dialog-title" className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="category-dialog-title" className="text-xl font-bold">添加通用类别</h2><p className="mt-1 text-sm text-slate-500">中英文名称都会保存，显示时跟随系统语言。</p></div>
          <button type="button" aria-label="关闭" onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18}/></button>
        </div>
        <form action={createCommonCategory} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="nameZh">中文名称</Label><Input className="h-11 rounded-xl" id="nameZh" name="nameZh" required maxLength={60} autoFocus placeholder="例如：餐饮"/></div>
            <div className="space-y-2"><Label htmlFor="nameEn">英文名称</Label><Input className="h-11 rounded-xl" id="nameEn" name="nameEn" required maxLength={60} placeholder="e.g. Food"/></div>
          </div>
          <div className="space-y-2"><Label htmlFor="parentId">所属一级类别</Label><select id="parentId" name="parentId" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"><option value="">无，创建一级类别</option>{roots.map((root) => <option key={root.id} value={root.id}>{root.name_zh} · {root.name_en}</option>)}</select><p className="text-xs text-slate-500">选择已有类别时，将创建它的二级类别。</p></div>
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">取消</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">确认添加</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}

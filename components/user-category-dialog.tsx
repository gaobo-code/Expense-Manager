"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { createUserCategory, updateUserCategory } from "@/app/categories/actions";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryName, type Category } from "@/lib/categories";

type EditableCategory = Pick<Category, "id" | "name_zh" | "name_en">;
type RootCategory = Pick<Category, "id" | "name_zh" | "name_en">;

export function UserCategoryDialog({ category, roots = [], compact = false }: { category?: EditableCategory; roots?: RootCategory[]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const { language, t } = useLanguage();
  const editing = Boolean(category);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  return <>
    {editing ? (
      <Button type="button" variant="ghost" size="icon" onClick={() => { setNameError(false); setOpen(true); }} className={`${compact ? "size-7 rounded-full" : "size-9 rounded-lg"} text-slate-500 hover:bg-emerald-50 hover:text-emerald-700`} aria-label={t("editCategory")}><Pencil size={compact ? 12 : 15} /></Button>
    ) : (
      <Button type="button" onClick={() => { setNameError(false); setOpen(true); }} className="h-11 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"><Plus size={18} />{t("addCategory")}</Button>
    )}

    {open ? <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="user-category-title" className="relative max-h-[calc(100%-1rem)] w-full scroll-pt-6 overflow-y-auto overscroll-y-contain rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-full sm:max-w-lg sm:rounded-2xl sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="user-category-title" className="text-xl font-bold">{editing ? t("editCategory") : t("addCategory")}</h2><p className="mt-1 text-sm text-slate-500">{t("categoryFormDescription")}</p></div>
          <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={18} /></button>
        </div>
        <form action={editing ? updateUserCategory : createUserCategory} className="space-y-5" onSubmit={(event) => {
          const formData = new FormData(event.currentTarget);
          const nameZh = String(formData.get("nameZh") ?? "").trim();
          const nameEn = String(formData.get("nameEn") ?? "").trim();
          if (!nameZh && !nameEn) {
            event.preventDefault();
            setNameError(true);
          }
        }}>
          {category ? <input type="hidden" name="categoryId" value={category.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor={`user-name-zh-${category?.id ?? "new"}`}>{t("chineseName")}</Label><Input id={`user-name-zh-${category?.id ?? "new"}`} name="nameZh" className={`h-11 scroll-my-20 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} maxLength={60} autoFocus defaultValue={category?.name_zh} onChange={() => setNameError(false)} placeholder="例如：餐饮" /></div>
            <div className="space-y-2"><Label htmlFor={`user-name-en-${category?.id ?? "new"}`}>{t("englishName")}</Label><Input id={`user-name-en-${category?.id ?? "new"}`} name="nameEn" className={`h-11 scroll-my-20 rounded-xl ${nameError ? "border-red-300 focus-visible:ring-red-300" : ""}`} maxLength={60} defaultValue={category?.name_en} onChange={() => setNameError(false)} placeholder="e.g. Food" /></div>
          </div>
          {nameError ? <p role="alert" className="text-sm font-medium text-red-600">{t("categoryNameRequired")}</p> : null}
          {!editing ? <div className="space-y-2"><Label htmlFor="user-parent-id">{t("parentCategory")}</Label><select id="user-parent-id" name="parentId" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"><option value="">{t("createRootCategory")}</option>{roots.map((root) => <option key={root.id} value={root.id}>{getCategoryName(root, language)}</option>)}</select><p className="text-xs text-slate-500">{t("parentCategoryDescription")}</p></div> : null}
          <div className="flex gap-3 pt-1"><Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl">{t("cancel")}</Button><Button type="submit" className="h-11 flex-[1.5] rounded-xl bg-emerald-600 hover:bg-emerald-700">{editing ? t("saveChanges") : t("confirmAdd")}</Button></div>
        </form>
      </div>
    </div> : null}
  </>;
}

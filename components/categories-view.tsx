"use client";

import { Folder, FolderTree, LockKeyhole, Tag } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import { UserCategoryDialog } from "@/components/user-category-dialog";
import { getCategoryName, type Category } from "@/lib/categories";

export function CategoriesView({ categories, hasError, errorCode }: { categories: Category[]; hasError: boolean; errorCode?: string }) {
  const { language, t } = useLanguage();
  const roots = categories.filter((item) => item.parent_id === null);
  const children = new Map<number, Category[]>();

  for (const item of categories) {
    if (item.parent_id !== null) children.set(item.parent_id, [...(children.get(item.parent_id) ?? []), item]);
  }

  return <PageShell><section>
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0"><p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm">{t("appName")}</p><h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t("categories")}</h1><p className="mt-2 hidden text-slate-500 sm:block">{t("categoriesDescription")}</p></div>
      <UserCategoryDialog roots={roots} />
    </div>

    {hasError || errorCode ? <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{hasError ? t("categoriesUnavailable") : t("categoryOperationFailed")}</div> : null}

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <div><h2 className="font-semibold text-slate-900">{t("allCategories")}</h2><p className="mt-1 text-xs text-slate-500 sm:text-sm">{t("allCategoriesDescription")}</p></div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{t("categoryCount", { count: String(categories.length) })}</span>
      </header>

      {!hasError && roots.length === 0 ? <div className="grid min-h-64 place-items-center p-6 text-center"><div><FolderTree className="mx-auto text-slate-300" size={38} /><p className="mt-4 font-semibold text-slate-900">{t("noCategories")}</p><p className="mt-1 text-sm text-slate-500">{t("noCategoriesDescription")}</p></div></div> : null}

      {roots.length ? <div>{roots.map((root) => {
        const items = children.get(root.id) ?? [];
        const editable = root.user_id !== null;
        return <article className="border-b border-slate-200 last:border-b-0" key={root.id}>
          <div className={`flex min-h-16 items-center gap-3 border-l-4 px-4 py-3 sm:px-6 ${editable ? "border-violet-500 bg-violet-50/50" : "border-emerald-500 bg-emerald-50/50"}`}>
            <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${editable ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}><Folder size={18} /></span>
            <div className="min-w-0 flex-1"><h3 className="truncate font-bold text-slate-900">{getCategoryName(root, language)}</h3><p className="mt-0.5 text-xs text-slate-500">{t("subcategoryCount", { count: String(items.length) })}</p></div>
            {editable ? <UserCategoryDialog category={root} /> : <LockKeyhole className="mr-2 text-slate-300" size={16} />}
          </div>
          {items.length ? <div className="relative ml-[2.375rem] py-1 pr-4 before:absolute before:bottom-8 before:left-0 before:top-0 before:w-px before:bg-slate-300 sm:mr-2 sm:pr-6">{items.map((item) => {
            const childEditable = item.user_id !== null;
            const name = getCategoryName(item, language);
            return <div className="relative flex min-h-14 items-center pl-7" key={item.id}>
              <span className="absolute left-0 top-1/2 h-px w-5 bg-slate-300" />
              <div className={`flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${childEditable ? "border-violet-100 bg-violet-50/70 hover:border-violet-200" : "border-slate-200 bg-slate-50 hover:border-emerald-200"}`}>
                <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${childEditable ? "bg-violet-100 text-violet-600" : "bg-slate-200 text-slate-500"}`}><Tag size={13} /></span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{name}</span>
                {childEditable ? <UserCategoryDialog category={item} compact /> : null}
              </div>
            </div>;
          })}</div> : null}
        </article>;
      })}</div> : null}
    </div>
  </section></PageShell>;
}

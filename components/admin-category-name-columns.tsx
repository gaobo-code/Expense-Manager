"use client";

import { useAdminLanguage } from "@/components/admin-language-provider";
import { Folder } from "lucide-react";

type CategoryNames = { name_zh: string; name_en: string };

export function AdminCategoryHeaders() {
  const { language, t } = useAdminLanguage();
  const first = language === "en" ? t("englishName") : t("chineseName");
  const second = language === "en" ? t("chineseName") : t("englishName");
  return <><span>{first}</span><span>{second}</span><span className="text-right">{language === "en" ? "Level" : "层级"}</span></>;
}

export function AdminCategoryNameColumns({ category, root = false }: { category: CategoryNames; root?: boolean }) {
  const { language } = useAdminLanguage();
  const primary = language === "en" ? category.name_en : category.name_zh;
  const secondary = language === "en" ? category.name_zh : category.name_en;

  return <>
    <div className={`flex min-w-0 items-center ${root ? "gap-3" : "gap-2"}`}>
      {root ? <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100"><Folder size={18} className="fill-emerald-100 text-emerald-700"/></span> : null}
      <span className={`truncate ${root ? "font-bold text-slate-900" : "text-sm font-medium text-slate-700"}`}>{primary}</span>
      <span className={`truncate sm:hidden ${root ? "text-sm text-slate-500" : "text-xs text-slate-400"}`}>{secondary}</span>
    </div>
    <span className="hidden truncate text-sm text-slate-500 sm:block">{secondary}</span>
  </>;
}

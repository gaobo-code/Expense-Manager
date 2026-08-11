"use client";

import { Check, Languages, Settings } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { type Language, useLanguage } from "@/components/language-provider";

export function SettingsView() {
  const { language, setLanguage, t } = useLanguage();
  const options: { value: Language; label: string }[] = [{ value: "en", label: t("english") }, { value: "zh", label: t("chinese") }];
  return <PageShell><section><div className="mb-8 flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Settings size={24} /></span><div><h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1><p className="mt-1 text-slate-500">{t("settingsDescription")}</p></div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-start gap-3"><Languages className="mt-0.5 text-emerald-600" size={22} /><div><h2 className="font-semibold text-slate-950">{t("language")}</h2><p className="mt-1 text-sm text-slate-500">{t("languageDescription")}</p></div></div><div className="grid gap-3 sm:grid-cols-2">{options.map((option) => <button key={option.value} type="button" onClick={() => setLanguage(option.value)} className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left font-medium transition-colors ${language === option.value ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><span>{option.label}</span>{language === option.value ? <Check size={19} /> : null}</button>)}</div></div></section></PageShell>;
}

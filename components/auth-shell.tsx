"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { BarChart3, CheckCircle2, Globe2, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";

const copy = {
  en: {
    tagline: "Know where your money comes and goes",
    title: "A clearer view of your money.",
    description: "Record income and expenses, understand your cash flow, and make calmer financial decisions.",
    features: ["Track income and expenses", "Clear cash-flow insights", "Private and secure"],
    preview: "This month",
    spent: "Net balance",
    trend: "12% higher than last month",
  },
  zh: {
    tagline: "清楚掌握每一笔收支",
    title: "让你的每一笔钱，都清晰可见。",
    description: "轻松记录收入与支出，了解资金流向，更从容地做出财务决定。",
    features: ["轻松记录收入和支出", "清晰掌握现金流趋势", "数据安全且私密"],
    preview: "本月概览",
    spent: "本月结余",
    trend: "比上月增加 12%",
  },
};

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const text = copy[language];

  return (
    <main className="relative min-h-svh overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_90%_90%,rgba(20,184,166,0.10),transparent_30%)]" />
      <header className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <WalletCards size={21} />
          </span>
          <span className="text-lg">Money Manager</span>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <Button
            className="h-8 gap-1.5 px-2.5 text-xs"
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            type="button"
            variant="ghost"
          >
            <Globe2 size={15} />
            {language === "en" ? "中文" : "EN"}
          </Button>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <section className="hidden max-w-xl lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ReceiptText size={16} /> {text.tagline}
          </div>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-6xl">{text.title}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">{text.description}</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
            {text.features.map((feature) => (
              <div className="flex items-center gap-3" key={feature}>
                <CheckCircle2 className="text-emerald-600" size={19} /> {feature}
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-md rounded-3xl border border-white/80 bg-white/75 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500 dark:text-slate-400">{text.preview}</span>
              <BarChart3 className="text-emerald-600" size={20} />
            </div>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{text.spent}</p>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight">¥ 3,842.50</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{text.trend}</span>
            </div>
            <div className="mt-6 flex h-16 items-end gap-2" aria-hidden="true">
              {[35, 55, 42, 70, 48, 82, 62, 92, 68, 78].map((height, index) => (
                <span className="flex-1 rounded-t bg-emerald-500/80" key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          {children}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={15} />
            {language === "zh" ? "你的账户与数据均受到安全保护" : "Your account and data are securely protected"}
          </div>
        </section>
      </div>
    </main>
  );
}

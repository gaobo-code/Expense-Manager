"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Globe2, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const copy = {
  en: {
    tagline: "Know where your money comes and goes",
    title: "A clearer view of your money.",
    description: "Record income and expenses, understand your cash flow, and make calmer financial decisions.",
    features: ["Track income and expenses", "Clear cash-flow insights", "Private and secure"],
    preview: "This month",
    spent: "Net balance",
    trend: "12% higher than last month",
    continue: "Continue to sign in",
    back: "Back",
  },
  zh: {
    tagline: "清楚掌握每一笔收支",
    title: "让你的每一笔钱，都清晰可见。",
    description: "轻松记录收入与支出，了解资金流向，更从容地做出财务决定。",
    features: ["轻松记录收入和支出", "清晰掌握现金流趋势", "数据安全且私密"],
    preview: "本月概览",
    spent: "本月结余",
    trend: "比上月增加 12%",
    continue: "继续登录",
    back: "返回",
  },
};

export function AuthShell({
  children,
  initialMobileScreen = "intro",
  mobileBackHref,
}: {
  children: React.ReactNode;
  initialMobileScreen?: "intro" | "form";
  mobileBackHref?: string;
}) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [mobileScreen, setMobileScreen] = useState<"intro" | "form">(initialMobileScreen);
  const text = copy[language];

  const handleBrandClick = () => {
    if (mobileScreen === "form" && mobileBackHref && window.innerWidth < 1024) {
      router.push(mobileBackHref);
      return;
    }

    setMobileScreen("intro");
  };

  return (
    <main className="relative h-dvh overflow-x-hidden overflow-y-auto overscroll-y-contain bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_90%_90%,rgba(20,184,166,0.10),transparent_30%)]" />
      <header className="absolute inset-x-0 top-0 z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button className="flex items-center gap-3 font-bold tracking-tight" onClick={handleBrandClick} type="button">
          <span className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            {mobileScreen === "form" ? <ArrowLeft className="lg:hidden" size={21} /> : null}
            <WalletCards className={mobileScreen === "form" ? "hidden lg:block" : "block"} size={21} />
          </span>
          <span className="text-lg">{mobileScreen === "form" ? <><span className="lg:hidden">{text.back}</span><span className="hidden lg:inline">Money Manager</span></> : "Money Manager"}</span>
        </button>
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
        </div>
      </header>

      <div className="relative z-10 mx-auto min-h-dvh max-w-7xl lg:grid lg:h-svh lg:min-h-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-12 lg:pt-28">
        <section className={`absolute inset-x-0 top-0 flex min-h-dvh flex-col justify-center px-5 pb-8 pt-24 transition-[transform,opacity] duration-500 ease-out sm:px-8 lg:pointer-events-auto lg:static lg:min-h-0 lg:max-w-xl lg:translate-x-0 lg:px-0 lg:py-0 lg:opacity-100 ${mobileScreen === "intro" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}>
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 sm:mb-6 sm:text-sm">
            <ReceiptText size={16} /> {text.tagline}
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl xl:text-6xl">{text.title}</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">{text.description}</p>
          <div className="mt-5 grid gap-2.5 text-sm text-slate-700 dark:text-slate-200 sm:mt-8 sm:gap-3">
            {text.features.map((feature) => (
              <div className="flex items-center gap-3" key={feature}>
                <CheckCircle2 className="text-emerald-600" size={19} /> {feature}
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-md rounded-3xl border border-white/80 bg-white/75 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 sm:mt-10 sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500 dark:text-slate-400">{text.preview}</span>
              <BarChart3 className="text-emerald-600" size={20} />
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:mt-5">{text.spent}</p>
            <div className="mt-1 flex items-end justify-between gap-2 whitespace-nowrap">
              <span className="shrink-0 text-3xl font-bold tracking-tight">
                {language === "zh" ? "¥ 3,842.50" : "$ 842.50"}
              </span>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 sm:px-2.5 sm:text-xs dark:bg-emerald-950 dark:text-emerald-300">{text.trend}</span>
            </div>
            <div className="mt-4 flex h-10 items-end gap-2 sm:mt-6 sm:h-16" aria-hidden="true">
              {[35, 55, 42, 70, 48, 82, 62, 92, 68, 78].map((height, index) => (
                <span className="flex-1 rounded-t bg-emerald-500/80" key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <button className="mt-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur transition hover:bg-emerald-50 lg:hidden" onClick={() => setMobileScreen("form")} type="button">
            {text.continue}<ArrowRight size={16} />
          </button>
        </section>

        <section className={`absolute inset-x-0 top-0 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 pb-6 pt-24 transition-[transform,opacity] duration-500 ease-out sm:px-8 lg:pointer-events-auto lg:static lg:min-h-0 lg:translate-x-0 lg:px-0 lg:py-0 lg:opacity-100 ${mobileScreen === "form" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
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

"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check, MailCheck, ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";

const copy = {
  en: {
    eyebrow: "Account created",
    title: "Check your email",
    description:
      "We sent you a confirmation link. Open it to activate your Money Manager account.",
    hint: "Can’t find it? Check your spam or junk folder.",
    back: "Back to sign in",
    secure: "Your account and data are securely protected",
  },
  zh: {
    eyebrow: "账户已创建",
    title: "请检查你的邮箱",
    description:
      "我们已向你发送确认链接。打开链接，即可激活你的 Money Manager 账户。",
    hint: "没有收到邮件？请检查垃圾邮件或广告邮件文件夹。",
    back: "返回登录",
    secure: "你的账户与数据均受到安全保护",
  },
} as const;

export default function Page() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-50 px-5 py-24 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_85%_85%,rgba(20,184,166,0.12),transparent_30%)]" />

      <Link
        className="absolute left-5 top-5 z-20 flex items-center gap-3 font-bold tracking-tight sm:left-8 sm:top-8"
        href="/auth/login"
      >
        <span className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <WalletCards size={21} />
        </span>
        <span className="text-lg">Money Manager</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="items-center px-6 pb-5 pt-8 text-center sm:px-8 sm:pt-10">
            <div className="relative mb-3 grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-950/40">
              <MailCheck size={38} strokeWidth={1.8} />
              <span className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full border-4 border-white bg-emerald-600 text-white dark:border-slate-900">
                <Check size={13} strokeWidth={3} />
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              {text.eyebrow}
            </p>
            <CardTitle className="pt-1 text-3xl tracking-tight">
              {text.title}
            </CardTitle>
            <CardDescription className="max-w-sm pt-1 leading-6">
              {text.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
            <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              {text.hint}
            </p>

            <Button
              asChild
              className="mt-6 h-11 w-full rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <Link href="/auth/login">
                <ArrowLeft size={17} />
                {text.back}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={15} />
          {text.secure}
        </div>
      </div>
    </main>
  );
}

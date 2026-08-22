"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const stopPasswordViewportTracking = useRef<() => void>(() => {});
  const { language } = useLanguage();
  const text = language === "zh" ? {
    eyebrow: "欢迎回来",
    title: "登录你的账户",
    description: "继续记录收入与支出，掌握你的财务节奏。",
    email: "邮箱",
    emailPlaceholder: "请输入邮箱地址",
    password: "密码",
    passwordPlaceholder: "请输入密码",
    forgot: "忘记密码？",
    loading: "正在登录…",
    submit: "登录",
    noAccount: "还没有账户？",
    signUp: "免费注册",
    invalidCredentials: "邮箱或密码错误",
    fallbackError: "登录时出现错误，请稍后重试",
  } : {
    eyebrow: "Welcome back",
    title: "Sign in to your account",
    description: "Continue tracking income and expenses, and stay in control of your money.",
    email: "Email",
    emailPlaceholder: "Enter your email address",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgot: "Forgot password?",
    loading: "Signing in…",
    submit: "Sign in",
    noAccount: "New to Money Manager?",
    signUp: "Create an account",
    invalidCredentials: "Invalid login credentials",
    fallbackError: "Something went wrong. Please try again.",
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const requestedPath = new URLSearchParams(window.location.search).get(
        "next",
      );
      const destination =
        requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/";

      // Use a full navigation so the freshly written Supabase auth cookies are
      // included before Proxy checks the destination request.
      window.location.assign(destination);
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      const hasInvalidCredentials =
        authError.code === "invalid_credentials" ||
        authError.message === "Invalid login credentials";

      setError(
        hasInvalidCredentials ? text.invalidCredentials : text.fallbackError,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => () => stopPasswordViewportTracking.current(), []);

  const handlePasswordFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const viewport = window.visualViewport;
    const timers: number[] = [];

    stopPasswordViewportTracking.current();

    const keepInputVisible = () => {
      if (document.activeElement !== input) return;

      const rect = input.getBoundingClientRect();
      const visibleTop = viewport?.offsetTop ?? 0;
      const visibleBottom = visibleTop + (viewport?.height ?? window.innerHeight);
      const safeGap = 24;

      if (
        rect.top < visibleTop + safeGap ||
        rect.bottom > visibleBottom - safeGap
      ) {
        // An instant correction avoids racing the keyboard's own animation.
        input.scrollIntoView({ block: "center", inline: "nearest" });
      }
    };

    viewport?.addEventListener("resize", keepInputVisible);
    viewport?.addEventListener("scroll", keepInputVisible);
    window.addEventListener("resize", keepInputVisible);

    // Browsers report the keyboard resize at different points in its animation.
    // The viewport listeners handle normal updates; these checks cover WebViews
    // that only publish the final viewport dimensions.
    [0, 100, 250, 500, 800].forEach((delay) => {
      timers.push(window.setTimeout(keepInputVisible, delay));
    });

    stopPasswordViewportTracking.current = () => {
      timers.forEach(window.clearTimeout);
      viewport?.removeEventListener("resize", keepInputVisible);
      viewport?.removeEventListener("scroll", keepInputVisible);
      window.removeEventListener("resize", keepInputVisible);
    };
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-3xl border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="space-y-3 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{text.eyebrow}</p>
          <CardTitle className="text-3xl tracking-tight">{text.title}</CardTitle>
          <CardDescription className="leading-6">{text.description}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
          <form autoComplete="off" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{text.email}</Label>
                <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18} /><Input autoComplete="off" className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60" id="email" name="email" type="email" inputMode="email" placeholder={text.emailPlaceholder} required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{text.password}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {text.forgot}
                  </Link>
                </div>
                <div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><Input autoComplete="new-password" className="h-11 scroll-my-24 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60" id="password" name="password" type="password" placeholder={text.passwordPlaceholder} required value={password} onBlur={() => stopPasswordViewportTracking.current()} onChange={(e) => setPassword(e.target.value)} onFocus={handlePasswordFocus} /></div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? text.loading : <>{text.submit}<ArrowRight /></>}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {text.noAccount}{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                {text.signUp}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

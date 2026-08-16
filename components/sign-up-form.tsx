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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const text = language === "zh" ? {
    eyebrow: "开始管理", title: "创建你的账户", description: "只需一分钟，开始使用 Money Manager。",
    email: "邮箱", emailPlaceholder: "请输入邮箱地址", password: "密码", passwordPlaceholder: "至少输入 6 位密码",
    confirm: "确认密码", confirmPlaceholder: "再次输入密码", mismatch: "两次输入的密码不一致",
    loading: "正在创建账户…", submit: "免费注册", hasAccount: "已经有账户？", login: "直接登录",
    fallbackError: "注册时出现错误，请稍后重试",
  } : {
    eyebrow: "Get started", title: "Create your account", description: "It only takes a minute to start managing your income and expenses clearly.",
    email: "Email", emailPlaceholder: "Enter your email address", password: "Password", passwordPlaceholder: "Use at least 6 characters",
    confirm: "Confirm password", confirmPlaceholder: "Enter your password again", mismatch: "Passwords do not match",
    loading: "Creating your account…", submit: "Create account", hasAccount: "Already have an account?", login: "Sign in",
    fallbackError: "Something went wrong. Please try again.",
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(text.mismatch);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : text.fallbackError);
    } finally {
      setIsLoading(false);
    }
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
          <form autoComplete="on" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{text.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  autoComplete="email"
                  className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60"
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder={text.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{text.password}</Label>
                </div>
                <div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><Input
                  autoComplete="new-password"
                  className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60"
                  id="password"
                  name="signup-password"
                  type="password"
                  placeholder={text.passwordPlaceholder}
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /></div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">{text.confirm}</Label>
                </div>
                <div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><Input
                  autoComplete="new-password"
                  className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60"
                  id="repeat-password"
                  name="signup-repeat-password"
                  type="password"
                  placeholder={text.confirmPlaceholder}
                  minLength={6}
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                /></div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? text.loading : <>{text.submit}<ArrowRight /></>}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {text.hasAccount}{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                {text.login}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const text = language === "zh" ? {
    eyebrow: "找回账户", title: "重置你的密码", description: "输入注册邮箱，我们会向你发送一封安全的密码重置邮件。", email: "邮箱", placeholder: "请输入注册邮箱", loading: "正在发送…", submit: "发送重置邮件", remember: "想起密码了？", login: "返回登录", sent: "邮件已发送", check: "请检查你的邮箱", sentDescription: "如果该邮箱已注册，你将很快收到密码重置链接。", hint: "没有看到邮件？请检查垃圾邮件文件夹，或稍后重新发送。", resend: "重新发送", fallback: "发送失败，请稍后重试。",
  } : {
    eyebrow: "Account recovery", title: "Reset your password", description: "Enter your account email and we’ll send you a secure password reset link.", email: "Email", placeholder: "Enter your account email", loading: "Sending…", submit: "Send reset email", remember: "Remember your password?", login: "Back to sign in", sent: "Email sent", check: "Check your inbox", sentDescription: "If this email is registered, a password reset link will arrive shortly.", hint: "Can’t find it? Check your spam folder or try sending it again in a moment.", resend: "Send again", fallback: "We couldn’t send the email. Please try again.",
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Keep RedirectTo free of query parameters so the recovery template can
        // safely append ?token_hash=...&type=recovery. Token hashes work across
        // browsers and devices because they do not depend on a PKCE verifier.
        redirectTo: `${window.location.origin}/auth/confirm`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : text.fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="rounded-3xl border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader className="space-y-3 px-6 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"><CheckCircle2 size={28} /></span>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{text.sent}</p>
            <CardTitle className="text-3xl tracking-tight">{text.check}</CardTitle>
            <CardDescription>{text.sentDescription}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
            <p className="rounded-2xl bg-emerald-50 p-4 text-center text-sm leading-6 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{text.hint}</p>
            <Button className="mt-5 h-11 w-full rounded-xl" variant="outline" onClick={() => setSuccess(false)}>{text.resend}</Button>
            <Link href="/auth/login" className="mt-4 flex items-center justify-center gap-2 text-sm"><ArrowLeft size={16} />{text.login}</Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader className="space-y-3 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">{text.eyebrow}</p>
            <CardTitle className="text-3xl tracking-tight">{text.title}</CardTitle>
            <CardDescription className="leading-6">{text.description}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{text.email}</Label>
                  <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    className="h-11 rounded-xl bg-slate-50 pl-10 dark:bg-slate-950/60"
                    id="email"
                    type="email"
                    placeholder={text.placeholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? text.loading : <>{text.submit}<ArrowRight /></>}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {text.remember}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  {text.login}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

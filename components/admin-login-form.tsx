"use client";

import { adminLogin, type AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { Languages, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useActionState, useState } from "react";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, initialState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { language, setLanguage } = useLanguage();
  const text = language === "zh" ? {
    eyebrow: "安全访问",
    title: "管理员登录",
    description: "此区域仅限管理员使用。所有管理操作都会进行权限验证。",
    username: "管理员账号",
    usernamePlaceholder: "请输入管理员账号",
    password: "管理员密码",
    passwordPlaceholder: "请输入管理员密码",
    required: "请输入管理员账号和密码。",
    invalid: "管理员账号或密码错误。",
    loading: "正在验证…",
    submit: "进入管理后台",
    switchLanguage: "Switch to English",
    switchLabel: "EN",
  } : {
    eyebrow: "Secure access",
    title: "Admin sign in",
    description: "This area is restricted to administrators. All management actions require authorization.",
    username: "Admin username",
    usernamePlaceholder: "Enter admin username",
    password: "Admin password",
    passwordPlaceholder: "Enter admin password",
    required: "Enter your admin username and password.",
    invalid: "Incorrect admin username or password.",
    loading: "Verifying…",
    submit: "Open admin dashboard",
    switchLanguage: "切换到中文",
    switchLabel: "中文",
  };
  const error = state.error === "required" ? text.required : state.error === "invalid" ? text.invalid : null;

  return (
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/10 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><ShieldCheck /></div>
        <Button type="button" variant="outline" size="sm" aria-label={text.switchLanguage} onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>
          <Languages />{text.switchLabel}
        </Button>
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{text.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{text.title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text.description}</p>

      <form action={action} autoComplete="off" className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="admin-username">{text.username}</Label>
          <div className="relative">
            <UserRound className="absolute left-3 top-3 text-slate-400" size={18} />
            <Input id="admin-username" name="username" autoComplete="off" required className="h-11 rounded-xl pl-10" placeholder={text.usernamePlaceholder} value={username} onChange={(event) => setUsername(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">{text.password}</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} />
            <Input id="admin-password" name="password" type="password" autoComplete="new-password" required className="h-11 rounded-xl pl-10" placeholder={text.passwordPlaceholder} value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
        </div>
        {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
          <ShieldCheck />{pending ? text.loading : text.submit}
        </Button>
      </form>
    </section>
  );
}

"use client";

import { adminLogout } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, ShieldCheck, Tags, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/admin/categories", label: "类别", icon: Tags },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentLabel = items.find((item) => isActive(pathname, item.href))?.label ?? "管理员控制台";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 font-bold text-slate-950" href="/admin/categories">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white"><ShieldCheck size={19} /></span>
            <span className="hidden md:inline">管理员控制台</span>
            <span className="md:hidden">{currentLabel}</span>
          </Link>

          <nav aria-label="管理员导航" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <form action={adminLogout}><Button type="submit" variant="outline"><LogOut />退出</Button></form>
          </div>

          <button aria-expanded={open} aria-label="打开管理员菜单" className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => setOpen(true)} type="button">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="关闭管理员菜单" className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} type="button" />
          <aside className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-950">管理菜单</span>
              <button aria-label="关闭管理员菜单" className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setOpen(false)} type="button"><X size={22} /></button>
            </div>
            <nav aria-label="手机端管理员导航" className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
                    <Icon size={20} />{item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-slate-200 pt-4">
              <form action={adminLogout}><Button type="submit" variant="ghost" className="h-11 w-full justify-start rounded-xl bg-slate-50 px-4 text-base font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"><LogOut />退出</Button></form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

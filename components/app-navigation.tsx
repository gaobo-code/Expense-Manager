"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Menu,
  ReceiptText,
  Settings,
  Tags,
  WalletCards,
  X,
} from "lucide-react";
import { type MessageKey, useLanguage } from "@/components/language-provider";
import { LogoutButton } from "@/components/logout-button";
import { AccountMenu } from "@/components/account-menu";

const items = [
  { label: "transactions" as MessageKey, href: "/", icon: ReceiptText },
  { label: "accounts" as MessageKey, href: "/accounts", icon: WalletCards },
  { label: "categories" as MessageKey, href: "/categories", icon: Tags },
  { label: "analysis" as MessageKey, href: "/analysis", icon: BarChart3 },
  { label: "alerts" as MessageKey, href: "/alerts", icon: Bell },
  { label: "settings" as MessageKey, href: "/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const currentLabel = items.find((item) => isActive(pathname, item.href))?.label ?? "transactions";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 font-bold text-slate-950" href="/">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
              <WalletCards size={19} />
            </span>
            <span className="hidden md:inline">{t("appName")}</span>
            <span className="md:hidden">{t(currentLabel)}</span>
          </Link>

          <nav aria-label="Main navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:block"><AccountMenu /></div>

          <button
            aria-expanded={open}
            aria-label="Open navigation menu"
            className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen(true)}
            type="button"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-950">{t("menu")}</span>
              <button
                aria-label="Close navigation menu"
                className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={22} />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={20} />
                    {t(item.label)}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-slate-200 pt-4">
              <LogoutButton className="h-11 w-full justify-start rounded-xl bg-slate-50 px-4 text-base font-medium text-slate-600 hover:bg-red-50 hover:text-red-700" />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { LogoutButton } from "@/components/logout-button";
import { useLanguage } from "@/components/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserRound } from "lucide-react";

export function AccountMenu() {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("account")}
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          type="button"
        >
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <UserRound size={16} />
          </span>
          <span>{t("account")}</span>
          <ChevronDown className="text-slate-400 transition-transform group-data-[state=open]:rotate-180" size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-2xl border-slate-200 p-2 shadow-xl" sideOffset={10}>
        <DropdownMenuLabel className="px-3 py-2.5">
          <p className="font-semibold text-slate-900">Money Manager</p>
          <p className="mt-0.5 text-xs font-normal text-slate-500">{t("accountDescription")}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-100" />
        <LogoutButton className="h-10 w-full justify-start rounded-xl px-3 text-red-600 hover:bg-red-50 hover:text-red-700" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

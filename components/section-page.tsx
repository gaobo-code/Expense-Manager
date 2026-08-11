"use client";

import { BarChart3, Bell, WalletCards } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { type MessageKey, useLanguage } from "@/components/language-provider";

type Section = "accounts" | "analysis" | "alerts";

export function SectionPage({
  section,
}: {
  section: Section;
}) {
  const { t } = useLanguage();
  const descriptionKey = `${section}Description` as MessageKey;
  const Icon = { accounts: WalletCards, analysis: BarChart3, alerts: Bell }[section];

  return (
    <PageShell>
      <section>
        <div className="mb-8 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t(section)}</h1>
            <p className="mt-1 text-slate-500">{t(descriptionKey)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          {t("emptySection", { section: t(section).toLowerCase() })}
        </div>
      </section>
    </PageShell>
  );
}

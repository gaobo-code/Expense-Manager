"use client";

import { Bell, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import type { Notice } from "@/lib/notices";

export function AlertsView({ notices, hasError }: { notices: Notice[]; hasError: boolean }) {
  const { language, t } = useLanguage();

  return (
    <PageShell>
      <section className="-mx-2 -mt-4 sm:mx-0 sm:mt-0">
        <div className="mb-8 hidden items-center gap-4 md:flex">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Bell size={24} />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("alerts")}</h1>
            <p className="mt-1 text-slate-500">{t("alertsDescription")}</p>
          </div>
        </div>

        {hasError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {t("alertsUnavailable")}
          </div>
        ) : notices.length === 0 ? (
          <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div>
              <Bell className="mx-auto text-slate-300" size={42} />
              <h2 className="mt-4 font-semibold text-slate-900">{t("noAlerts")}</h2>
              <p className="mt-1 text-sm text-slate-500">{t("noAlertsDescription")}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
              {notices.map((notice) => {
                const title = language === "zh" ? notice.title_zh : notice.title_en;
                const content = language === "zh" ? notice.content_zh : notice.content_en;
                return (
                  <article key={notice.id} className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative aspect-square w-32 shrink-0 self-start overflow-hidden bg-slate-100 sm:w-44">
                      {notice.thumbnail_data ? (
                        <Image src={`data:${notice.thumbnail_mime};base64,${notice.thumbnail_data}`} alt="" fill unoptimized className="object-cover" />
                      ) : (
                        <ImageIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <h2 className="line-clamp-2 break-words font-bold text-slate-900">{title}</h2>
                      <p className="mt-1 line-clamp-3 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">{content}</p>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </section>
    </PageShell>
  );
}

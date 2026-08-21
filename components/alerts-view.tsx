"use client";

import { useEffect, useState } from "react";
import { Bell, ImageIcon, Play, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import type { Notice } from "@/lib/notices";

export function AlertsView({ notices, hasError }: { notices: Notice[]; hasError: boolean }) {
  const { language, t } = useLanguage();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!selectedNotice) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNotice(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedNotice]);

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
                  <button
                    key={notice.id}
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
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
                  </button>
                );
              })}
          </div>
        )}
      </section>

      {selectedNotice ? (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 backdrop-blur-[2px] sm:place-items-center sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedNotice(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-platform-title"
            className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id="video-platform-title" className="text-xl font-bold text-slate-950">
                  {t("chooseVideoPlatform")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{t("chooseVideoPlatformDescription")}</p>
              </div>
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => setSelectedNotice(null)}
                className="grid size-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                { name: "YouTube", mark: "YT", color: "bg-red-600" },
                { name: "Vimeo", mark: "V", color: "bg-sky-500" },
                { name: "Youku", mark: "优", color: "bg-gradient-to-br from-sky-500 to-pink-500" },
              ].map((platform) => (
                <button
                  key={platform.name}
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="group flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-3 text-left font-semibold text-slate-900 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span className={`grid size-9 place-items-center rounded-xl text-xs font-bold text-white ${platform.color}`}>
                    {platform.mark}
                  </span>
                  <span className="flex-1">{platform.name}</span>
                  <Play size={17} className="text-slate-400 transition group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}

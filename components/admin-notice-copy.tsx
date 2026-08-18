"use client";

import { useAdminLanguage } from "@/components/admin-language-provider";

export function AdminNoticeTitle({ zh, en }: { zh: string; en: string }) {
  const { language } = useAdminLanguage();
  return <>{language === "en" ? en || zh : zh || en}</>;
}

export function AdminNoticeContent({ zh, en }: { zh: string; en: string }) {
  const { language } = useAdminLanguage();
  return <>{language === "en" ? en || zh : zh || en}</>;
}

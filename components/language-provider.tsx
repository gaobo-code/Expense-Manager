"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "zh";

const messages = {
  en: {
    appName: "Expense Manager",
    menu: "Menu",
    transactions: "Transactions",
    accounts: "Accounts",
    analysis: "Analysis",
    alerts: "Alerts",
    settings: "Settings",
    transactionsDescription: "A summary of your recent expenses.",
    accountsDescription: "Manage your financial accounts.",
    analysisDescription: "Understand where your money goes.",
    alertsDescription: "Review notifications and spending alerts.",
    settingsDescription: "Customize your expense manager.",
    date: "Date",
    amount: "Amount",
    category: "Category",
    unavailable: "Transactions are temporarily unavailable. Apply the Supabase migration to create the transactions table.",
    emptySection: "Your {section} content will appear here.",
    language: "Language",
    languageDescription: "Choose the language used throughout the app.",
    english: "English",
    chinese: "中文",
  },
  zh: {
    appName: "支出管理",
    menu: "菜单",
    transactions: "交易",
    accounts: "账户",
    analysis: "分析",
    alerts: "提示",
    settings: "设置",
    transactionsDescription: "查看近期支出的汇总信息。",
    accountsDescription: "管理您的财务账户。",
    analysisDescription: "了解您的资金去向。",
    alertsDescription: "查看通知和支出提示。",
    settingsDescription: "自定义您的支出管理应用。",
    date: "日期",
    amount: "金额",
    category: "类别",
    unavailable: "暂时无法获取交易数据，请应用 Supabase 迁移以创建交易表。",
    emptySection: "您的{section}内容将显示在这里。",
    language: "语言",
    languageDescription: "选择整个应用使用的语言。",
    english: "English",
    chinese: "中文",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("expense-language");
    if (saved === "en" || saved === "zh") setLanguageState(saved);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("expense-language", nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
  };

  const t = (key: MessageKey, values?: Record<string, string>) => {
    let text: string = messages[language][key];
    Object.entries(values ?? {}).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, value);
    });
    return text;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

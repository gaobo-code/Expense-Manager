"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "zh";
export type DateFormat = "DD/MM/YYYY" | "DD/MM/YY" | "DD/MM" | "MM/DD/YYYY" | "MM/DD/YY" | "MM/DD" | "YYYY/MM/DD" | "YY/MM/DD";

const messages = {
  en: {
    appName: "Money Manager",
    menu: "Menu",
    transactions: "Transactions",
    accounts: "Accounts",
    analysis: "Analysis",
    alerts: "Alerts",
    settings: "Settings",
    logout: "Log out",
    loggingOut: "Logging out…",
    account: "Account",
    accountDescription: "Manage your current session",
    transactionsDescription: "A summary of your recent expenses.",
    accountsDescription: "Manage your financial accounts.",
    analysisDescription: "Understand where your money goes.",
    alertsDescription: "Review notifications and spending alerts.",
    settingsDescription: "Customize Money Manager.",
    date: "Date",
    amount: "Amount",
    category: "Category",
    unavailable: "Transactions are temporarily unavailable. Apply the Supabase migration to create the transactions table.",
    emptySection: "Your {section} content will appear here.",
    language: "Language",
    languageDescription: "Choose the language used throughout the app.",
    english: "English",
    chinese: "中文",
    dateFormat: "Date format",
    dateFormatDescription: "Choose how dates are displayed throughout the app.",
  },
  zh: {
    appName: "Money Manager",
    menu: "菜单",
    transactions: "交易",
    accounts: "账户",
    analysis: "分析",
    alerts: "提示",
    settings: "设置",
    logout: "退出登录",
    loggingOut: "正在退出…",
    account: "账户",
    accountDescription: "管理当前登录状态",
    transactionsDescription: "查看近期支出的汇总信息。",
    accountsDescription: "管理您的财务账户。",
    analysisDescription: "了解您的资金去向。",
    alertsDescription: "查看通知和支出提示。",
    settingsDescription: "自定义 Money Manager。",
    date: "日期",
    amount: "金额",
    category: "类别",
    unavailable: "暂时无法获取交易数据，请应用 Supabase 迁移以创建交易表。",
    emptySection: "您的{section}内容将显示在这里。",
    language: "语言",
    languageDescription: "选择整个应用使用的语言。",
    english: "English",
    chinese: "中文",
    dateFormat: "日期格式",
    dateFormatDescription: "选择整个应用中日期的显示格式。",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dateFormat: DateFormat;
  setDateFormat: (format: DateFormat) => void;
  formatDate: (date: string | Date) => string;
  t: (key: MessageKey, values?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [dateFormat, setDateFormatState] = useState<DateFormat>("MM/DD/YYYY");

  useEffect(() => {
    const saved = window.localStorage.getItem("expense-language");
    if (saved === "en" || saved === "zh") setLanguageState(saved);
    const savedDateFormat = window.localStorage.getItem("expense-date-format") as DateFormat | null;
    if (["DD/MM/YYYY", "DD/MM/YY", "DD/MM", "MM/DD/YYYY", "MM/DD/YY", "MM/DD", "YYYY/MM/DD", "YY/MM/DD"].includes(savedDateFormat ?? "")) setDateFormatState(savedDateFormat!);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("expense-language", nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
  };

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
    window.localStorage.setItem("expense-date-format", format);
  };

  const formatDate = (value: string | Date) => {
    const date = typeof value === "string" ? new Date(value) : value;
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = String(date.getUTCFullYear());
    const parts: Record<DateFormat, string> = {
      "DD/MM/YYYY": `${day}/${month}/${year}`,
      "DD/MM/YY": `${day}/${month}/${year.slice(-2)}`,
      "DD/MM": `${day}/${month}`,
      "MM/DD/YYYY": `${month}/${day}/${year}`,
      "MM/DD/YY": `${month}/${day}/${year.slice(-2)}`,
      "MM/DD": `${month}/${day}`,
      "YYYY/MM/DD": `${year}/${month}/${day}`,
      "YY/MM/DD": `${year.slice(-2)}/${month}/${day}`,
    };
    return parts[dateFormat];
  };

  const t = (key: MessageKey, values?: Record<string, string>) => {
    let text: string = messages[language][key];
    Object.entries(values ?? {}).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, value);
    });
    return text;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, dateFormat, setDateFormat, formatDate, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

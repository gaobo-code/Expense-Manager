"use client";

import { createContext, useContext, useState } from "react";
import { saveDateFormat, saveLanguage } from "@/app/settings/actions";

export type Language = "en" | "zh";
export type DateFormat = "DD/MM/YYYY" | "DD/MM/YY" | "DD/MM" | "MM/DD/YYYY" | "MM/DD/YY" | "MM/DD" | "YYYY/MM/DD" | "YY/MM/DD";

const messages = {
  en: {
    appName: "Money Manager",
    menu: "Menu",
    transactions: "Transactions",
    accounts: "Accounts",
    categories: "Categories",
    analysis: "Analysis",
    alerts: "Alerts",
    settings: "Settings",
    logout: "Log out",
    loggingOut: "Logging out…",
    account: "Account",
    accountDescription: "Manage your current session",
    transactionsDescription: "A summary of your recent expenses.",
    accountsDescription: "Manage your financial accounts.",
    categoriesDescription: "Browse the categories available for organizing transactions.",
    categoryCount: "{count} categories",
    subcategoryCount: "{count} subcategories",
    noCategories: "No categories yet",
    noCategoriesDescription: "Categories added by an administrator will appear here.",
    categoriesUnavailable: "Categories are temporarily unavailable. Please try again later.",
    commonCategories: "Common categories",
    commonCategoriesDescription: "Managed by the administrator and available to everyone.",
    myCategories: "My categories",
    myCategoriesDescription: "Private categories linked to your account.",
    noCustomCategories: "No custom categories yet",
    noCustomCategoriesDescription: "Add a category to create your own structure.",
    addCategory: "Add category",
    editCategory: "Edit category",
    categoryFormDescription: "Enter at least one name. The displayed name follows your language setting.",
    chineseName: "Chinese name",
    englishName: "English name",
    parentCategory: "Parent category",
    createRootCategory: "None — create a top-level category",
    parentCategoryDescription: "Choose a common or custom top-level category to create a subcategory.",
    cancel: "Cancel",
    close: "Close",
    saveChanges: "Save changes",
    confirmAdd: "Add category",
    categoryOperationFailed: "The category could not be saved. Check the names and parent category, then try again.",
    categoryNameRequired: "Enter a Chinese or English name.",
    allCategories: "All categories",
    allCategoriesDescription: "Common and custom categories are shown together.",
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
    categories: "类别",
    analysis: "分析",
    alerts: "提示",
    settings: "设置",
    logout: "退出登录",
    loggingOut: "正在退出…",
    account: "账户",
    accountDescription: "管理当前登录状态",
    transactionsDescription: "查看近期支出的汇总信息。",
    accountsDescription: "管理您的财务账户。",
    categoriesDescription: "查看可用于整理交易的类别。",
    categoryCount: "{count} 个类别",
    subcategoryCount: "{count} 个子类别",
    noCategories: "暂无类别",
    noCategoriesDescription: "管理员添加的类别将显示在这里。",
    categoriesUnavailable: "暂时无法获取类别，请稍后重试。",
    commonCategories: "通用类别",
    commonCategoriesDescription: "由管理员维护，所有用户均可使用。",
    myCategories: "我的类别",
    myCategoriesDescription: "与你的账户绑定，仅供自己使用。",
    noCustomCategories: "还没有自定义类别",
    noCustomCategoriesDescription: "添加类别，创建自己的类别结构。",
    addCategory: "添加类别",
    editCategory: "编辑类别",
    categoryFormDescription: "中文名称和英文名称至少填写一个，显示名称会跟随语言设置。",
    chineseName: "中文名称",
    englishName: "英文名称",
    parentCategory: "所属一级类别",
    createRootCategory: "无，创建一级类别",
    parentCategoryDescription: "可以选择通用或自己创建的一级类别，在其下创建二级类别。",
    cancel: "取消",
    close: "关闭",
    saveChanges: "保存修改",
    confirmAdd: "确认添加",
    categoryOperationFailed: "类别保存失败，请检查名称和所属类别后重试。",
    categoryNameRequired: "中文名称和英文名称至少填写一个。",
    allCategories: "全部类别",
    allCategoriesDescription: "通用类别与自定义类别统一展示。",
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

export function LanguageProvider({
  children,
  initialLanguage = "en",
  initialDateFormat = "MM/DD/YYYY",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
  initialDateFormat?: DateFormat;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [dateFormat, setDateFormatState] = useState<DateFormat>(initialDateFormat);

  const setLanguage = (nextLanguage: Language) => {
    const previousLanguage = language;
    setLanguageState(nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
    document.cookie = `preferred_language=${nextLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
    void saveLanguage(nextLanguage).catch(() => {
      setLanguageState(previousLanguage);
      document.documentElement.lang = previousLanguage === "zh" ? "zh-CN" : "en";
      document.cookie = `preferred_language=${previousLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
    });
  };

  const setDateFormat = (format: DateFormat) => {
    const previousFormat = dateFormat;
    setDateFormatState(format);
    void saveDateFormat(format).catch(() => setDateFormatState(previousFormat));
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

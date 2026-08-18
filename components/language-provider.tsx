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
    counterparties: "Merchants & Customers",
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
    counterpartiesDescription: "Manage the merchants you pay and the customers you receive money from.",
    merchants: "Merchants",
    customers: "Customers",
    merchant: "Merchant",
    customer: "Customer",
    counterpartyCount: "{count} contacts",
    allCounterparties: "All merchants & customers",
    allCounterpartiesDescription: "These contacts are private to your account.",
    noCounterparties: "No merchants or customers yet",
    noCounterpartiesDescription: "Add your first contact to start building your list.",
    counterpartiesUnavailable: "Merchants and customers are temporarily unavailable. Apply the Supabase migration and try again.",
    addCounterparty: "Add contact",
    editCounterparty: "Edit contact",
    counterpartyFormDescription: "Store the details you use to identify this merchant or customer.",
    counterpartyType: "Type",
    counterpartyName: "Name",
    counterpartyNamePlaceholder: "e.g. Acme Supplies",
    counterpartyNameRequired: "Enter a name.",
    phone: "Phone",
    email: "Email",
    notes: "Notes",
    confirmAddCounterparty: "Add contact",
    counterpartyOperationFailed: "The contact could not be saved. Check the details and try again.",
    noContactDetails: "No contact details",
    customersDescription: "Manage customers associated with your account.",
    customerCount: "{count} customers",
    allCustomers: "All customers",
    allCustomersDescription: "Only customers belonging to your account are shown.",
    noCustomers: "No customers yet",
    noCustomersDescription: "Add a customer to start your list.",
    customersUnavailable: "Customers are temporarily unavailable. Apply the Supabase migration and try again.",
    addCustomer: "Add customer",
    editCustomer: "Edit customer",
    customerFormDescription: "Enter the customer's name.",
    customerName: "Customer name",
    customerNamePlaceholder: "e.g. Alex Chen",
    customerNameRequired: "Enter a customer name.",
    confirmAddCustomer: "Add customer",
    customerOperationFailed: "The customer could not be saved. Check the name and try again.",
    customerNameDuplicate: "A customer with this name already exists.",
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
    categoryFormDescription: "Enter the category name shown in English.",
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
    categoryNameRequired: "Enter a category name.",
    allCategories: "All categories",
    allCategoriesDescription: "Common and custom categories are shown together.",
    analysisDescription: "Understand where your money goes.",
    alertsDescription: "Review notifications and spending alerts.",
    noAlerts: "No alerts yet",
    noAlertsDescription: "New alerts from the administrator will appear here.",
    alertsUnavailable: "Alerts are temporarily unavailable. Please try again later.",
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
    counterparties: "商户与客户",
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
    counterpartiesDescription: "管理您的付款商户与收款客户，每个账户的数据相互独立。",
    merchants: "商户",
    customers: "客户",
    merchant: "商户",
    customer: "客户",
    counterpartyCount: "{count} 个联系人",
    allCounterparties: "全部商户与客户",
    allCounterpartiesDescription: "这些联系人仅对您的账户可见。",
    noCounterparties: "暂无商户或客户",
    noCounterpartiesDescription: "添加第一个联系人，开始建立您的列表。",
    counterpartiesUnavailable: "暂时无法获取商户与客户，请应用 Supabase 迁移后重试。",
    addCounterparty: "添加商户或客户",
    editCounterparty: "编辑联系人",
    counterpartyFormDescription: "记录用于识别此商户或客户的信息。",
    counterpartyType: "类型",
    counterpartyName: "名称",
    counterpartyNamePlaceholder: "例如：幸福超市",
    counterpartyNameRequired: "请输入名称。",
    phone: "电话",
    email: "邮箱",
    notes: "备注",
    confirmAddCounterparty: "确认添加",
    counterpartyOperationFailed: "联系人保存失败，请检查填写内容后重试。",
    noContactDetails: "暂无联系方式",
    customersDescription: "管理与当前登录账户关联的客户。",
    customerCount: "{count} 个客户",
    allCustomers: "全部客户",
    allCustomersDescription: "这里只显示属于您当前账户的客户。",
    noCustomers: "暂无客户",
    noCustomersDescription: "添加一个客户，开始建立您的客户列表。",
    customersUnavailable: "暂时无法获取客户，请应用 Supabase 迁移后重试。",
    addCustomer: "添加客户",
    editCustomer: "编辑客户",
    customerFormDescription: "请输入客户名称。",
    customerName: "客户名称",
    customerNamePlaceholder: "例如：张三",
    customerNameRequired: "请输入客户名称。",
    confirmAddCustomer: "确认添加",
    customerOperationFailed: "客户保存失败，请检查名称后重试。",
    customerNameDuplicate: "已存在同名客户，请使用其他名称。",
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
    categoryFormDescription: "请输入类别的中文名称。",
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
    categoryNameRequired: "请输入类别名称。",
    allCategories: "全部类别",
    allCategoriesDescription: "通用类别与自定义类别统一展示。",
    analysisDescription: "了解您的资金去向。",
    alertsDescription: "查看通知和支出提示。",
    noAlerts: "暂无提示",
    noAlertsDescription: "管理员发布的新提示将显示在这里。",
    alertsUnavailable: "暂时无法获取提示，请稍后重试。",
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
    if (window.location.pathname.startsWith("/admin")) return;
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

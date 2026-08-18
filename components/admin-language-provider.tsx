"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AdminLanguage = "zh" | "en";

const messages = {
  zh: { console: "管理员控制台", menu: "管理菜单", categories: "类别", notices: "提示", logout: "退出", openMenu: "打开管理员菜单", closeMenu: "关闭管理员菜单", switchLanguage: "Switch to English", addCategory: "添加类别", editCategory: "编辑类别名称", editCategoryHint: "修改中文名称和英文名称，不会改变类别层级。", addCommonCategory: "添加通用类别", addCategoryHint: "中英文名称都会保存，显示时跟随系统语言。", chineseName: "中文名称", englishName: "英文名称", parentCategory: "所属一级类别", noParent: "无，创建一级类别", parentHint: "选择已有类别时，将创建它的二级类别。", cancel: "取消", save: "保存修改", confirmAdd: "确认添加", close: "关闭", addNotice: "添加提示", addNoticeHint: "填写中英文内容并上传一张缩略图。", editNotice: "修改提示", editNoticeHint: "不选择新图片时将保留当前缩略图。", deleteNotice: "删除提示", deleteConfirm: "删除这条提示？", delete: "删除", chineseTitle: "中文标题", chineseContent: "中文内容", englishTitle: "英文标题", englishContent: "英文内容", thumbnail: "提示缩略图", chooseImage: "点击选择图片", replaceImage: "替换图片", imageTypes: "JPG、PNG、WebP 或 GIF，最大 2MB", preview: "缩略图预览" },
  en: { console: "Admin Console", menu: "Admin menu", categories: "Categories", notices: "Notices", logout: "Log out", openMenu: "Open admin menu", closeMenu: "Close admin menu", switchLanguage: "切换到中文", addCategory: "Add category", editCategory: "Edit category names", editCategoryHint: "Update both names without changing the category level.", addCommonCategory: "Add common category", addCategoryHint: "Both names are saved and displayed according to the selected language.", chineseName: "Chinese name", englishName: "English name", parentCategory: "Parent category", noParent: "None — create a top-level category", parentHint: "Select an existing category to create a subcategory under it.", cancel: "Cancel", save: "Save changes", confirmAdd: "Add", close: "Close", addNotice: "Add notice", addNoticeHint: "Enter the Chinese and English content and upload a thumbnail.", editNotice: "Edit notice", editNoticeHint: "The current thumbnail is kept unless you select a new image.", deleteNotice: "Delete notice", deleteConfirm: "Delete this notice?", delete: "Delete", chineseTitle: "Chinese title", chineseContent: "Chinese content", englishTitle: "English title", englishContent: "English content", thumbnail: "Notice thumbnail", chooseImage: "Choose an image", replaceImage: "Replace image", imageTypes: "JPG, PNG, WebP or GIF, up to 2 MB", preview: "Thumbnail preview" },
} as const;
export type AdminMessageKey = keyof typeof messages.zh;
const AdminLanguageContext = createContext<{ language: AdminLanguage; setLanguage: (language: AdminLanguage) => void; t: (key: AdminMessageKey) => string } | null>(null);

const interfaceTranslations: Record<string, string> = {
  "类别管理": "Category management", "维护所有用户共享的一级与二级类别": "Manage the top-level and subcategories shared by all users", "通用类别列表": "Common categories", "中文名称": "Chinese name", "英文名称": "English name", "层级": "Level", "一级": "Top", "二级": "Sub", "暂无二级类别": "No subcategories", "还没有通用类别": "No common categories yet", "点击“添加类别”创建第一个一级类别": "Select “Add category” to create the first top-level category", "操作失败，请检查中英文名称后重试。": "The operation failed. Check both names and try again.", "无法读取类别，请先应用最新的 Supabase 迁移。": "Categories could not be loaded. Apply the latest Supabase migration first.",
  "提示管理": "Notice management", "创建和管理需要展示给用户的提示内容": "Create and manage notices shown to users", "提示列表": "Notices", "按创建时间从新到旧排列": "Newest first", "还没有提示": "No notices yet", "点击“添加提示”创建第一条内容": "Select “Add notice” to create the first one", "无法读取提示，请先应用最新的 Supabase 迁移。": "Notices could not be loaded. Apply the latest Supabase migration first.", "提示已添加。": "Notice added.", "提示已修改。": "Notice updated.", "操作失败，请检查输入内容后重试。": "The operation failed. Check the content and try again.", "缩略图格式不支持或超过 2MB，请重新选择。": "The image format is unsupported or the file exceeds 2 MB.",
  "添加类别": "Add category", "添加通用类别": "Add common category", "中英文名称都会保存，显示时跟随系统语言。": "Both names are saved and displayed according to the selected language.", "例如：餐饮": "e.g. Dining", "所属一级类别": "Parent category", "无，创建一级类别": "None — create a top-level category", "选择已有类别时，将创建它的二级类别。": "Select an existing category to create a subcategory under it.", "取消": "Cancel", "确认添加": "Add", "编辑类别名称": "Edit category names", "修改中文名称和英文名称，不会改变类别层级。": "Update both names without changing the category level.", "保存修改": "Save changes",
  "添加提示": "Add notice", "填写中英文内容并上传一张缩略图。": "Enter the Chinese and English content and upload a thumbnail.", "中文标题": "Chinese title", "中文内容": "Chinese content", "英文标题": "English title", "英文内容": "English content", "请输入中文标题": "Enter the Chinese title", "请输入中文内容": "Enter the Chinese content", "提示缩略图": "Notice thumbnail", "点击选择图片": "Choose an image", "JPG、PNG、WebP 或 GIF，最大 2MB": "JPG, PNG, WebP or GIF, up to 2 MB", "修改提示": "Edit notice", "不选择新图片时将保留当前缩略图。": "The current thumbnail is kept unless you select a new image.", "替换图片": "Replace image", "删除提示": "Delete notice", "删除这条提示？": "Delete this notice?", "删除": "Delete", "关闭": "Close", "缩略图预览": "Thumbnail preview",
};

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>("zh");
  useEffect(() => { const saved = localStorage.getItem("admin_language"); if (saved === "zh" || saved === "en") setLanguageState(saved); }, []);
  const setLanguage = (next: AdminLanguage) => { setLanguageState(next); localStorage.setItem("admin_language", next); };
  useEffect(() => {
    const reverse = Object.fromEntries(Object.entries(interfaceTranslations).map(([zh, en]) => [en, zh]));
    const dictionary = language === "en" ? interfaceTranslations : reverse;
    const translate = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const value = node.nodeValue?.trim();
        if (value && dictionary[value]) node.nodeValue = node.nodeValue!.replace(value, dictionary[value]);
        else if (value) {
          const count = value.match(/^共 (\d+) 项$/); const levels = value.match(/^一级类别 (\d+) 个，二级类别 (\d+) 个$/);
          if (language === "en" && count) node.nodeValue = `${count[1]} items`;
          if (language === "en" && levels) node.nodeValue = `${levels[1]} top-level and ${levels[2]} subcategories`;
          const enCount = value.match(/^(\d+) items$/); const enLevels = value.match(/^(\d+) top-level and (\d+) subcategories$/);
          if (language === "zh" && enCount) node.nodeValue = `共 ${enCount[1]} 项`;
          if (language === "zh" && enLevels) node.nodeValue = `一级类别 ${enLevels[1]} 个，二级类别 ${enLevels[2]} 个`;
        }
      }
      if (root instanceof Element || root instanceof Document) root.querySelectorAll<HTMLElement>("[aria-label],[title],[placeholder]").forEach((element) => ["aria-label", "title", "placeholder"].forEach((attribute) => { const value = element.getAttribute(attribute); if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]); }));
    };
    translate(document.body);
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(translate)));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  return <AdminLanguageContext.Provider value={{ language, setLanguage, t: (key) => messages[language][key] }}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() { const context = useContext(AdminLanguageContext); if (!context) throw new Error("useAdminLanguage must be used within AdminLanguageProvider"); return context; }

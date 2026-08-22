import type { Language } from "@/components/language-provider";
export type AmountEffect = "increase" | "decrease";
export type Category = { id: number; parent_id: number | null; user_id: string | null; name_zh: string; name_en: string; amount_effect: AmountEffect; sort_order: number; created_at: string; updated_at: string };
export function getCategoryName(category: Pick<Category, "name_zh" | "name_en">, language: Language) {
  return language === "zh" ? category.name_zh || category.name_en : category.name_en || category.name_zh;
}

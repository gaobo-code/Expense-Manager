"use server";

import { createClient } from "@/lib/supabase/server";
import type { DateFormat, Language } from "@/components/language-provider";

const languages: Language[] = ["en", "zh"];
const dateFormats: DateFormat[] = [
  "DD/MM/YYYY", "DD/MM/YY", "DD/MM", "MM/DD/YYYY",
  "MM/DD/YY", "MM/DD", "YYYY/MM/DD", "YY/MM/DD",
];

export async function saveLanguage(language: Language) {
  if (!languages.includes(language)) throw new Error("Invalid language");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Authentication pages also use the language switcher. There is no user
  // preference row to update until the visitor has signed in.
  if (!user) return { persisted: false } as const;

  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: user.id, language, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
  return { persisted: true } as const;
}

export async function saveDateFormat(dateFormat: DateFormat) {
  if (!dateFormats.includes(dateFormat)) throw new Error("Invalid date format");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { persisted: false } as const;

  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: user.id, date_format: dateFormat, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
  return { persisted: true } as const;
}

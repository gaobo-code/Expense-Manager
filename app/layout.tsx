import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import type { DateFormat, Language } from "@/components/language-provider";
import { createClient } from "@/lib/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Money Manager",
  description: "Track and organize your everyday expenses.",
  applicationName: "Money Manager",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Money Manager",
  },
};

// User preferences come from the authenticated request, so this layout is
// intentionally rendered at request time instead of being prerendered.
export const instant = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: settings } = user
    ? await supabase
        .from("user_settings")
        .select("language, date_format")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };
  const language = (settings?.language ?? "en") as Language;
  const dateFormat = (settings?.date_format ?? "MM/DD/YYYY") as DateFormat;

  return (
    <html lang={language === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLanguage={language} initialDateFormat={dateFormat}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

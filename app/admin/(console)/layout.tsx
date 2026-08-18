import { AdminNavigation } from "@/components/admin-navigation";
import { AdminLanguageProvider } from "@/components/admin-language-provider";
import { requireAdmin } from "@/lib/admin";

// The console must verify the request-bound admin session before rendering.
export const instant = false;

export default async function AdminConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <AdminLanguageProvider><main className="min-h-screen bg-slate-50 text-slate-950">
      <AdminNavigation />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </main></AdminLanguageProvider>
  );
}

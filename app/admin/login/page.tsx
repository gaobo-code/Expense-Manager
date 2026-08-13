import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = { title: "Admin Login | Money Manager" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AdminLoginForm />
    </main>
  );
}

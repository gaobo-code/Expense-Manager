import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell initialMobileScreen="form" mobileBackHref="/auth/login">
      <ForgotPasswordForm />
    </AuthShell>
  );
}

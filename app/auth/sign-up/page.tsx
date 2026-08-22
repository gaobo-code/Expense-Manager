import { SignUpForm } from "@/components/sign-up-form";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell initialMobileScreen="form" mobileBackHref="/auth/login">
      <SignUpForm />
    </AuthShell>
  );
}

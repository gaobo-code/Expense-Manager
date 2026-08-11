import { WalletCards } from "lucide-react";
import { SectionPage } from "@/components/section-page";
export default function AccountsPage() {
  return (
    <SectionPage
      title="Accounts"
      description="Manage your financial accounts."
      icon={WalletCards}
    />
  );
}

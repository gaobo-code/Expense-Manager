import { Settings } from "lucide-react";
import { SectionPage } from "@/components/section-page";
export default function SettingsPage() {
  return (
    <SectionPage
      title="Settings"
      description="Customize your expense manager."
      icon={Settings}
    />
  );
}

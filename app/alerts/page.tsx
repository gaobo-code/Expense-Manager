import { Bell } from "lucide-react";
import { SectionPage } from "@/components/section-page";
export default function AlertsPage() {
  return (
    <SectionPage
      title="Alerts"
      description="Review notifications and spending alerts."
      icon={Bell}
    />
  );
}

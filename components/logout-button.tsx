"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const logout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      return;
    }
    window.location.assign("/auth/login");
  };

  return (
    <Button className={className} disabled={isLoading} onClick={logout} type="button" variant="ghost">
      <LogOut />
      {isLoading ? t("loggingOut") : t("logout")}
    </Button>
  );
}

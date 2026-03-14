"use client";

import { SidebarTrigger } from "@tokenization/ui/sidebar";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <SidebarTrigger className="md:hidden" />
      <div className="ml-auto">
        <LanguageSwitcher />
      </div>
    </header>
  );
}

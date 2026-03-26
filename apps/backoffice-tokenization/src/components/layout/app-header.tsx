"use client";

import { SidebarTrigger } from "@tokenization/ui/sidebar";
import { LanguageSwitcher } from "@tokenization/ui/language-switcher";
import { usePathname, useRouter } from "@/i18n/navigation";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <SidebarTrigger className="md:hidden" />
      <div className="ml-auto">
        <LanguageSwitcher
          pathname={pathname}
          onSwitchLocale={(locale) => router.replace(pathname, { locale })}
        />
      </div>
    </header>
  );
}

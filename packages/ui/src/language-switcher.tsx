"use client";

import { useLocale } from "next-intl";
import { cn } from "@tokenization/shared/lib/utils";

export type LanguageSwitcherLocale = "es" | "en";

export interface LanguageSwitcherProps {
  pathname: string;
  onSwitchLocale: (next: LanguageSwitcherLocale) => void;
  locales?: ReadonlyArray<{ code: LanguageSwitcherLocale; label: string }>;
}

const defaultLocales: ReadonlyArray<{ code: LanguageSwitcherLocale; label: string }> =
  [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
  ];

export function LanguageSwitcher({
  pathname: _pathname,
  onSwitchLocale,
  locales = defaultLocales,
}: LanguageSwitcherProps) {
  const locale = useLocale();

  function switchLocale(next: LanguageSwitcherLocale) {
    if (next === locale) return;
    onSwitchLocale(next);
  }

  return (
    <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            code === locale
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}


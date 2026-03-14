"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

type Messages = Record<string, unknown>;

type TranslationFn = (key: string, params?: Record<string, string | number>) => string;

interface SharedTranslationContextValue {
  t: TranslationFn;
  locale: string;
}

const SharedTranslationContext = createContext<SharedTranslationContextValue | null>(null);

function getNestedValue(obj: Messages, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

interface SharedTranslationProviderProps {
  messages: Messages;
  locale: string;
  children: ReactNode;
}

export function SharedTranslationProvider({
  messages,
  locale,
  children,
}: SharedTranslationProviderProps) {
  const t: TranslationFn = useCallback(
    (key, params) => {
      const value = getNestedValue(messages, key);
      if (value === undefined) return key;
      return params ? interpolate(value, params) : value;
    },
    [messages],
  );

  return (
    <SharedTranslationContext.Provider value={{ t, locale }}>
      {children}
    </SharedTranslationContext.Provider>
  );
}

export function useSharedTranslation(): SharedTranslationContextValue {
  const ctx = useContext(SharedTranslationContext);
  if (!ctx) {
    throw new Error("useSharedTranslation must be used within SharedTranslationProvider");
  }
  return ctx;
}

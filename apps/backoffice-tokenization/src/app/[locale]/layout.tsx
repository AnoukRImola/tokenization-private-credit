import type { Metadata } from "next";
import "../globals.css";
import { ReactQueryClientProvider } from "@tokenization/tw-blocks-shared/src/providers/ReactQueryClientProvider";
import { TrustlessWorkProvider } from "@tokenization/tw-blocks-shared/src/providers/TrustlessWork";
import { EscrowProvider } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import { EscrowDialogsProvider } from "@tokenization/tw-blocks-shared/src/providers/EscrowDialogsProvider";
import { EscrowAmountProvider } from "@tokenization/tw-blocks-shared/src/providers/EscrowAmountProvider";
import { Toaster } from "@tokenization/ui/sonner";
import { WalletProvider } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@tokenization/shared/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { SharedTranslationProvider } from "@tokenization/tw-blocks-shared/src/i18n/TranslationProvider";
import sharedEn from "@tokenization/tw-blocks-shared/src/i18n/messages/en.json";
import sharedEs from "@tokenization/tw-blocks-shared/src/i18n/messages/es.json";
import appEn from "../../../messages/en.json";
import appEs from "../../../messages/es.json";

const sharedMessages: Record<string, Record<string, unknown>> = { en: sharedEn, es: sharedEs };
const appMessages: Record<string, Record<string, unknown>> = { en: appEn, es: appEs };

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Backoffice Tokenization",
  description: "Backoffice Tokenization",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = appMessages[locale] ?? appMessages.es;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={cn(inter.variable, "antialiased font-sans")}>
        <NextIntlClientProvider messages={messages} locale={locale} formats={{}} now={new Date()} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}>
          <SharedTranslationProvider messages={sharedMessages[locale] ?? sharedMessages.es} locale={locale}>
            <ReactQueryClientProvider>
              <TrustlessWorkProvider>
                <WalletProvider>
                  <EscrowProvider>
                    <EscrowDialogsProvider>
                      <EscrowAmountProvider>
                        {children}
                        <Toaster position="top-right" />
                      </EscrowAmountProvider>
                    </EscrowDialogsProvider>
                  </EscrowProvider>
                </WalletProvider>
              </TrustlessWorkProvider>
            </ReactQueryClientProvider>
          </SharedTranslationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

import { ReactQueryClientProvider } from "@tokenization/tw-blocks-shared/src/providers/ReactQueryClientProvider";
import { TrustlessWorkProvider } from "@tokenization/tw-blocks-shared/src/providers/TrustlessWork";
import { Toaster } from "sonner";
import { EscrowProvider } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import { WalletProvider } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { ReactNode } from "react";
// Use these imports to wrap your application (<ReactQueryClientProvider>, <TrustlessWorkProvider>, <WalletProvider> y <EscrowProvider>)

const Exo2 = localFont({
  src: "./fonts/Exo2.ttf",
  variable: "---exo-2",
  weight: "100 900",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Investor Tokenization",
  description: "Investor Tokenization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={cn(
          Exo2.variable,
          "antialiased",
          spaceGrotesk.className,
        )}
      >
        <ReactQueryClientProvider>
          <TrustlessWorkProvider>
            <WalletProvider>
              <EscrowProvider>
                {children}
                <Toaster position="top-right" richColors />
              </EscrowProvider>
            </WalletProvider>
          </TrustlessWorkProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}

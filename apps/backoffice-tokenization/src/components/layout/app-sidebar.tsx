"use client";

import Image from "next/image";
import { TrendingUp, Wallet } from "lucide-react";
import {
  AppSidebar as SharedAppSidebar,
  type AppSidebarNavItem,
  type AppSidebarLogoConfig,
} from "@tokenization/ui/app-sidebar";
import { SidebarWalletButton } from "@tokenization/ui/sidebar-wallet-button";
import { useTranslations } from "next-intl";

const logo: AppSidebarLogoConfig = {
  element: (
    <Image
      src="/interactuar_logo.png"
      alt="interactuar"
      width={160}
      height={32}
      priority
      style={{ objectFit: "contain" }}
    />
  ),
  href: "/",
};

export function AppSidebar() {
  const t = useTranslations("nav");

  const navItems: AppSidebarNavItem[] = [
    {
      label: t("campaigns"),
      href: "/campaigns",
      icon: Wallet,
    },
    {
      label: t("roi"),
      href: "/roi",
      icon: TrendingUp,
    },
  ];

  return (
    <SharedAppSidebar
      navItems={navItems}
      logo={logo}
      footerContent={<SidebarWalletButton />}
    />
  );
}

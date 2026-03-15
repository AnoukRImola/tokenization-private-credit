"use client";

import Image from "next/image";
import { BookOpen, TrendingUp, Wallet } from "lucide-react";
import {
  AppSidebar as SharedAppSidebar,
  type AppSidebarNavItem,
  type AppSidebarFooterItem,
  type AppSidebarLogoConfig,
} from "@tokenization/ui/app-sidebar";
import { SidebarWalletButton } from "@tokenization/ui/sidebar-wallet-button";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

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
  const pathname = usePathname();

  const footerItems: AppSidebarFooterItem[] = [
    {
      label: t("documentation"),
      icon: BookOpen,
      href: "https://interactuar.gitbook.io/interactuar-x-trustless/",
      tooltip: t("documentationTooltip"),
    },
  ];

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
      pathname={pathname}
      navItems={navItems}
      logo={logo}
      footerItems={footerItems}
      footerContent={<SidebarWalletButton />}
    />
  );
}

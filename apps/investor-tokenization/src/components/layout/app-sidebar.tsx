"use client";

import Image from "next/image";
import { BookOpen, Megaphone, TrendingUp } from "lucide-react";
import {
  AppSidebar as SharedAppSidebar,
  type AppSidebarNavItem,
  type AppSidebarFooterItem,
  type AppSidebarLogoConfig,
} from "@tokenization/ui/app-sidebar";
import { SidebarWalletButton } from "@tokenization/ui/sidebar-wallet-button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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

const footerItems: AppSidebarFooterItem[] = [
  {
    label: "Documentation",
    icon: BookOpen,
    href: "https://interactuar.gitbook.io/interactuar-x-trustless/",
    tooltip: "View documentation",
  },
];

export function AppSidebar() {
  const t = useTranslations("nav");

  const navItems: AppSidebarNavItem[] = [
    {
      label: t("campaigns"),
      href: "/campaigns",
      icon: Megaphone,
    },
    {
      label: t("myInvestments"),
      href: "/my-investments",
      icon: TrendingUp,
    },
  ];

  return (
    <SharedAppSidebar
      navItems={navItems}
      logo={logo}
      footerItems={footerItems}
      footerContent={<SidebarWalletButton />}
    />
  );
}

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

const navItems: AppSidebarNavItem[] = [
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    label: "My Investments",
    href: "/my-investments",
    icon: TrendingUp,
  },
];

const footerItems: AppSidebarFooterItem[] = [
  {
    label: "Documentation",
    icon: BookOpen,
    href: "https://docs.example.com",
    tooltip: "View documentation",
  },
];

export function AppSidebar() {
  return (
    <SharedAppSidebar
      navItems={navItems}
      logo={logo}
      footerItems={footerItems}
      footerContent={<SidebarWalletButton />}
    />
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Megaphone, LineChart } from "lucide-react";
import { WalletButton } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletButtons";

type SidebarLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const links: SidebarLink[] = [
  {
    href: "/campaigns",
    label: "Manage Campaigns",
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    href: "/roi",
    label: "ROI",
    icon: <LineChart className="h-4 w-4" />,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary/10">
            <Image
              src="/favicon.ico"
              alt="Interactuar logo"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            interactuar
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                  isActive
                    ? "border-sidebar-primary-foreground/40 bg-sidebar-primary-foreground/10"
                    : "border-border bg-background",
                ].join(" ")}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: wallet + profile */}
      <div className="mb-4 mt-2 flex flex-col gap-3 px-4">
        <div className="rounded-xl bg-secondary p-2">
          <WalletButton />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-secondary">
              <Image
                src="/favicon.ico"
                alt="User avatar"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Project owner
              </span>
              <span className="text-sm font-semibold">Emilia</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
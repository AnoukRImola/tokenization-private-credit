"use client";

import { PointerHighlight } from "@tokenization/ui/pointer-highlight";
import { BentoGridThirdDemo } from "./BentoGrid";
import { Link } from "@/i18n/navigation";
import { RainbowButton } from "@tokenization/ui/rainbow-button";
import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations("home");

  return (
    <div className="flex w-full gap-20 justify-between items-center">
      <div className="flex flex-col py-20 gap-4 w-full md:w-1/3">
        <div className="text-xl font-bold tracking-tight md:text-6xl">
          {t("heroTitle")}
          <PointerHighlight>
            <span>{t("heroHighlight")}</span>
          </PointerHighlight>
        </div>

        <p className="text-lg text-muted-foreground">
          {t("heroDescription")}
        </p>

        <Link href="/campaigns">
          <RainbowButton variant="outline">{t("openApp")}</RainbowButton>
        </Link>
      </div>

      <div className="flex-1 w-full md:w-2/3">
        <BentoGridThirdDemo />
      </div>
    </div>
  );
};

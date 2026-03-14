"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations("home");

  const CARDS = [
    { title: t("cardFinancing"), description: t("cardFinancingDesc") },
    { title: t("cardSupport"), description: t("cardSupportDesc") },
    { title: t("cardStrengthening"), description: t("cardStrengtheningDesc") },
    { title: t("cardOpportunities"), description: t("cardOpportunitiesDesc") },
  ] as const;

  const cardClassName = "rounded-2xl border border-slate-200 bg-white p-3 shadow-lg backdrop-blur-sm";

  return (
    <>
    <section className="relative flex w-full flex-col gap-4 overflow-hidden px-4 pt-10 pb-2 md:min-h-[55vh] md:flex-row md:items-center md:gap-0 md:px-0 md:pt-12 md:pb-4">
      {/* Row 1 / Column 1: info */}
      <div className="relative z-10 flex w-full flex-col gap-5 bg-[#def1f8] px-0 py-6 md:w-[38%] md:gap-6 md:py-8 md:pl-4 md:pr-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("heroDescription")}
        </p>
        <p className="text-2xl font-bold italic tracking-tight text-sky-600 md:text-3xl">
          {t("heroTagline")}
        </p>
        <Link
          href="/campaigns"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-700"
        >
          {t("openApp")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile: row 2 = background image only */}
      <div className="relative min-h-[55vh] w-full bg-[url('/landing-bg.jpeg')] bg-contain bg-center bg-no-repeat md:hidden" />

      {/* Desktop: right zone image only */}
      <div className="relative hidden flex-1 bg-[#def1f8] bg-contain bg-center bg-no-repeat md:flex md:min-h-[380px] md:bg-[url('/landing-bg.jpeg')]" />
    </section>

    {/* Section below: centered title + 4 cards in a row */}
    <section className="w-full bg-[#def1f8] px-4 pt-6 pb-10 md:px-8 md:pt-6 md:pb-12">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-6xl">
        {t("aboutUs")}
      </h2>
      <div className="mx-auto grid w-full grid-cols-2 gap-3 px-3 md:grid-cols-4 md:gap-4 md:px-6">
        {CARDS.map((c) => (
          <div key={c.title} className={cardClassName}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{c.title}</p>
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground md:text-sm">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  </>
  );
}

"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { RoiView } from "@/features/campaigns/components/roi/roi-view";
import { useTranslations } from "next-intl";

export default function RoiPage() {
  const t = useTranslations("roi");

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t("title")}
        description={t("description")}
      />
      <RoiView />
    </div>
  );
}

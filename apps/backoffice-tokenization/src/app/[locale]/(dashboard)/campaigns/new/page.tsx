"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { CreateCampaignStepper } from "@/features/campaigns/components/create/create-campaign-stepper";
import { useTranslations } from "next-intl";

export default function NewCampaignPage() {
  const t = useTranslations("createCampaign");

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t("title")}
        description={t("description")}
      />
      <CreateCampaignStepper />
    </div>
  );
}

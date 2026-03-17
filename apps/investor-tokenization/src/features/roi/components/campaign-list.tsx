"use client";

import { useTranslations } from "next-intl";
import type { Campaign } from "../types/campaign.types";
import { CampaignCard } from "@/components/shared/campaign-card";

type CampaignListProps = {
  campaigns: Campaign[];
  onClaimRoi?: (campaignId: string) => void;
};

export function CampaignList({ campaigns, onClaimRoi }: CampaignListProps) {
  const t = useTranslations("campaigns");

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <p className="text-sm">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onClaimRoi={onClaimRoi}
        />
      ))}
    </div>
  );
}

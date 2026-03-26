"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { SharedCampaignsView } from "@tokenization/features/campaign";
import type { SharedCampaign } from "@tokenization/shared/src/types/campaign";
import { CampaignsGrid } from "@/features/transparency/CampaignsGrid";
import { fetchCampaigns } from "@/features/transparency/services/campaign.service";
import type { CampaignFromApi, CampaignStatus } from "@/features/roi/types/campaign.types";

const HIDDEN_STATUSES: CampaignStatus[] = ["DRAFT", "PAUSED"];

function apiToShared(c: CampaignFromApi): SharedCampaign {
  return {
    id: c.id,
    title: c.name,
    description: c.description ?? "",
    status: c.status,
    loansCompleted: 0,
    investedAmount: 0,
    currency: "USDC",
    vaultId: c.vaultId ?? null,
    escrowId: c.escrowId,
    poolSize: c.poolSize,
  };
}

export default function CampaignsPage() {
  const t = useTranslations("campaigns");

  const { data: rawCampaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });

  const visibleRaw = rawCampaigns.filter((c) => !HIDDEN_STATUSES.includes(c.status));
  const campaigns: SharedCampaign[] = visibleRaw.map(apiToShared);

  const toolbarLabels = {
    searchPlaceholder: t("searchPlaceholder"),
    filterAll: t("filterAll"),
    filterFundraising: t("filterFundraising"),
    filterActive: t("filterActive"),
    filterRepayment: t("filterRepayment"),
    filterClaimable: t("filterClaimable"),
    filterClosed: t("filterClosed"),
  };

  return (
    <SharedCampaignsView
      title={t("title")}
      description={t("description")}
      campaigns={campaigns}
      isLoading={isLoading}
      loadingMessage={t("loading")}
      emptyMessage={t("empty")}
      toolbarLabels={toolbarLabels}
    >
      {(filteredCampaigns: SharedCampaign[]) => {
        const ids = new Set(filteredCampaigns.map((c) => c.id));
        const rawFiltered = visibleRaw.filter((r) => ids.has(r.id));
        return <CampaignsGrid campaigns={rawFiltered} />;
      }}
    </SharedCampaignsView>
  );
}

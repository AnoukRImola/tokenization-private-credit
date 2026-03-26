"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SharedCampaignsView } from "@tokenization/features/campaign";
import { CampaignList } from "@/features/roi/components/campaign-list";
import type { Campaign, CampaignStatus } from "@/features/roi/types/campaign.types";
import { useUserInvestments } from "@/features/investments/hooks/useUserInvestments.hook";
import type { InvestmentFromApi } from "@/features/investments/services/investment.service";
import { useClaimROI } from "@/features/claim-roi/hooks/useClaimROI";

function toCampaign(inv: InvestmentFromApi): Campaign {
  return {
    id: inv.campaign.id,
    title: inv.campaign.name,
    description: inv.campaign.description ?? "",
    status: inv.campaign.status as CampaignStatus,
    loansCompleted: 0,
    investedAmount: Number(inv.usdcAmount),
    currency: "USDC",
    vaultId: inv.campaign.vaultId ?? null,
    escrowId: inv.campaign.escrowId,
    poolSize: Number(inv.campaign.poolSize),
  };
}

function aggregateByCampaign(investments: InvestmentFromApi[]): Campaign[] {
  const map = new Map<string, Campaign>();
  for (const inv of investments) {
    const existing = map.get(inv.campaign.id);
    if (existing) {
      existing.investedAmount += Number(inv.usdcAmount);
    } else {
      map.set(inv.campaign.id, toCampaign(inv));
    }
  }
  return Array.from(map.values());
}

export default function MyInvestmentsPage() {
  const t = useTranslations("investments");
  const tCampaigns = useTranslations("campaigns");
  const tClaimRoi = useTranslations("claimRoi");

  const { data: investments, isLoading } = useUserInvestments();
  const campaigns = useMemo(
    () => aggregateByCampaign(investments ?? []),
    [investments],
  );

  const { claimROI } = useClaimROI({
    noVault: tClaimRoi("noVaultAvailable"),
    connectWallet: tClaimRoi("connectToClaim"),
    buildFailed: tClaimRoi("buildFailed"),
    claimFailed: tClaimRoi("claimFailed"),
    success: tClaimRoi("claimSuccess"),
    unexpectedError: tClaimRoi("unexpectedError"),
  });

  const handleClaimRoi = useCallback(
    async (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign?.vaultId) return;
      await claimROI({ vaultContractId: campaign.vaultId });
    },
    [campaigns, claimROI],
  );

  const toolbarLabels = {
    searchPlaceholder: tCampaigns("searchPlaceholder"),
    filterAll: tCampaigns("filterAll"),
    filterFundraising: tCampaigns("filterFundraising"),
    filterActive: tCampaigns("filterActive"),
    filterRepayment: tCampaigns("filterRepayment"),
    filterClaimable: tCampaigns("filterClaimable"),
    filterClosed: tCampaigns("filterClosed"),
  };

  return (
    <SharedCampaignsView
      title={t("title")}
      description={t("trackDescription")}
      campaigns={campaigns}
      isLoading={isLoading}
      loadingMessage={t("loadingYourInvestments")}
      emptyMessage={tCampaigns("empty")}
      toolbarLabels={toolbarLabels}
    >
      {(filteredCampaigns) => (
        <CampaignList
          campaigns={filteredCampaigns}
          onClaimRoi={handleClaimRoi}
        />
      )}
    </SharedCampaignsView>
  );
}

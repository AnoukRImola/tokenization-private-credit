"use client";

import { useState, useMemo, useCallback } from "react";
import { SectionTitle } from "@tokenization/ui/section-title";
import { CampaignToolbar } from "@/features/roi/components/campaign-toolbar";
import { CampaignList } from "@/features/roi/components/campaign-list";
import type { Campaign, CampaignStatus } from "@/features/roi/types/campaign.types";
import { useUserInvestments } from "@/features/investments/hooks/useUserInvestments.hook";
import type { InvestmentFromApi } from "@/features/investments/services/investment.service";
import { useClaimROI } from "@/features/claim-roi/hooks/useClaimROI";
import { useTranslations } from "next-intl";

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
  const tClaimRoi = useTranslations("claimRoi");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const { data: investments, isLoading } = useUserInvestments();

  const { claimROI } = useClaimROI({
    noVault: tClaimRoi("noVaultAvailable"),
    connectWallet: tClaimRoi("connectToClaim"),
    buildFailed: tClaimRoi("buildFailed"),
    claimFailed: tClaimRoi("claimFailed"),
    success: tClaimRoi("claimSuccess"),
    unexpectedError: tClaimRoi("unexpectedError"),
  });

  const campaigns = useMemo(
    () => aggregateByCampaign(investments ?? []),
    [investments],
  );

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesStatus = filter === "all" || c.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [campaigns, search, filter]);

  const handleClaimRoi = useCallback(
    async (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign?.vaultId) return;
      await claimROI({ vaultContractId: campaign.vaultId });
    },
    [campaigns, claimROI],
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t("title")}
        description={t("trackDescription")}
      />
      <CampaignToolbar
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {t("loadingYourInvestments")}
        </p>
      ) : (
        <CampaignList campaigns={filteredCampaigns} onClaimRoi={handleClaimRoi} />
      )}
    </div>
  );
}

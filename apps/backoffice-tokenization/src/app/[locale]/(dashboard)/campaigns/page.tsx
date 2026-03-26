"use client";

import { Link } from "@/i18n/navigation";
import { SharedCampaignsView } from "@tokenization/features/campaign";
import { Button } from "@tokenization/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SharedCampaign } from "@tokenization/shared/src/types/campaign";
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import { CampaignList } from "@/features/campaigns/components/campaign-list";
import type { Campaign } from "@/features/campaigns/types/campaign.types";

function backofficeToShared(c: Campaign): SharedCampaign {
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

  const { data: rawCampaigns = [], isLoading, isError } = useCampaigns();
  const campaigns: SharedCampaign[] = rawCampaigns.map(backofficeToShared);

  const toolbarLabels = {
    searchPlaceholder: t("searchPlaceholder"),
    filterAll: t("filterAll"),
    filterFundraising: t("filterFundraising"),
    filterActive: t("filterActive"),
    filterRepayment: t("filterRepayment"),
    filterClaimable: t("filterClaimable"),
    filterClosed: t("filterClosed"),
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive text-sm">
        {t("loadError")}
      </div>
    );
  }

  return (
    <SharedCampaignsView
      title={t("title")}
      description={t("description")}
      campaigns={campaigns}
      isLoading={isLoading}
      loadingMessage={t("loading")}
      emptyMessage={t("empty")}
      headerActions={
        <Button size="lg" asChild>
          <Link href="/campaigns/new">
            <Plus size={16} />
            {t("newCampaign")}
          </Link>
        </Button>
      }
      toolbarLabels={toolbarLabels}
    >
      {(filteredCampaigns: SharedCampaign[]) => {
        const ids = new Set(filteredCampaigns.map((c) => c.id));
        const rawFiltered = rawCampaigns.filter((r) => ids.has(r.id));
        return <CampaignList campaigns={rawFiltered} />;
      }}
    </SharedCampaignsView>
  );
}

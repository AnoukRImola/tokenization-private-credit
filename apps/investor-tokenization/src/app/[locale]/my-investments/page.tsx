"use client";

import { useState, useMemo, useCallback } from "react";
import { SectionTitle } from "@/components/shared/section-title";
import { CampaignToolbar } from "@/features/roi/components/campaign-toolbar";
import { CampaignList } from "@/features/roi/components/campaign-list";
import type { Campaign, CampaignStatus } from "@/features/roi/types/campaign.types";
import { useUserInvestments } from "@/features/investments/hooks/useUserInvestments.hook";
import type { InvestmentFromApi } from "@/features/investments/services/investment.service";
import { ClaimROIService } from "@/features/claim-roi/services/claim.service";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { SendTransactionService } from "@/lib/sendTransactionService";
import { toastSuccessWithTx } from "@/lib/toastWithTx";
import { toast } from "sonner";
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
  const { walletAddress } = useWalletContext();

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

      if (!campaign?.vaultId) {
        toast.error(tClaimRoi("noVaultAvailable"));
        return;
      }

      if (!walletAddress) {
        toast.error(tClaimRoi("connectToClaim"));
        return;
      }

      try {
        const svc = new ClaimROIService();
        const claimResponse = await svc.claimROI({
          vaultContractId: campaign.vaultId,
          beneficiaryAddress: walletAddress,
        });

        if (!claimResponse?.success || !claimResponse?.xdr) {
          throw new Error(
            claimResponse?.message ?? tClaimRoi("buildFailed"),
          );
        }

        const signedTxXdr = await signTransaction({
          unsignedTransaction: claimResponse.xdr,
          address: walletAddress,
        });

        const sender = new SendTransactionService();
        const submitResponse = await sender.sendTransaction({
          signedXdr: signedTxXdr,
        });

        if (submitResponse.status !== "SUCCESS") {
          throw new Error(
            submitResponse.message ?? tClaimRoi("claimFailed"),
          );
        }

        toastSuccessWithTx(tClaimRoi("claimSuccess"), submitResponse.hash);
      } catch (e) {
        const msg = e instanceof Error ? e.message : tClaimRoi("unexpectedError");
        toast.error(msg);
      }
    },
    [campaigns, walletAddress, tClaimRoi],
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

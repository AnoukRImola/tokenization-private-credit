"use client";

import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
import { cn } from "@tokenization/shared/lib/utils";
import {
  Banknote,
  CheckCircle,
  Circle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import type { Campaign } from "../types/campaign.types";
import { getCampaignStatusConfig } from "../constants/campaign-status";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@tokenization/tw-blocks-shared/src/helpers/format.helper";

interface CampaignCardProps {
  campaign: Campaign;
  onClaimRoi?: (campaignId: string) => void;
}

export function CampaignCard({ campaign, onClaimRoi }: CampaignCardProps) {
  const t = useTranslations("campaigns");
  const tCommon = useTranslations("common");
  const tClaimRoi = useTranslations("claimRoi");
  const { title, description, status, id, escrowId, poolSize } = campaign;
  const statusCfg = getCampaignStatusConfig(t)[status];
  const escrowExplorerUrl = `https://viewer.trustlesswork.com/${escrowId}`;

  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  type EscrowFromIndexer = {
    milestones?: MultiReleaseMilestone[];
    [key: string]: unknown;
  };

  const { data: escrowData } = useQuery<EscrowFromIndexer | null>({
    queryKey: ["escrow", escrowId],
    queryFn: async (): Promise<EscrowFromIndexer | null> => {
      const data = (await getEscrowByContractIds({
        contractIds: [escrowId],
        validateOnChain: true,
      })) as unknown;

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      return data[0] as EscrowFromIndexer;
    },
    enabled: !!escrowId,
    staleTime: 1000 * 60 * 5,
  });

  const allMilestones = (escrowData?.milestones ?? []) as MultiReleaseMilestone[];
  const visibleMilestones = allMilestones.slice(1);
  const totalLoans = visibleMilestones.length;

  return (
    <SharedCampaignCard
      title={title}
      description={description || "No description"}
      statusBadge={
        <>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                statusCfg.className,
              )}
            >
              {statusCfg.label}
            </Badge>

            <Button
              variant="ghost"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer p-2 h-auto"
              asChild
            >
              <Link
                href={escrowExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>
        </>
      }
      actions={
        status === "CLAIMABLE" ? (
          <Button
            size="sm"
            className="cursor-pointer gap-1.5"
            onClick={() => onClaimRoi?.(id)}
          >
            <FileText className="size-3.5" />
            {tClaimRoi("claimButton")}
          </Button>
        ) : null
      }
      footer={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">
            <span className="font-bold">{t("poolSize")}:</span> USDC {formatCurrency((escrowData?.balance as number) ?? 0, "USDC")} / USDC {formatCurrency(campaign.poolSize, "USDC")}
          </span>
        </div>
      }
      stat={{ label: t("loans"), value: totalLoans }}
    >
      {visibleMilestones.length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {t("loans")}
          </p>
          <ul className="flex flex-col gap-1">
            {visibleMilestones.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                {m.flags?.approved ? (
                  <CheckCircle className="size-3.5 text-green-500 shrink-0" />
                ) : m.flags?.released ? (
                  <Banknote className="size-3.5 text-blue-500 shrink-0" />
                ) : (
                  <Circle className="size-3.5 shrink-0" />
                )}
                <span className="truncate">
                  {m.description || t("loan", { index: i + 1 })}
                </span>
                <span className="ml-auto font-medium">{m.amount} USDC</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">{t("noLoansAvailable")}</p>
      )}
    </SharedCampaignCard>
  );
}

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
import { cn } from "@tokenization/shared/lib/utils";
import { Banknote, CheckCircle, Circle, ExternalLink, FileText } from "lucide-react";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import type { Campaign } from "../types/campaign.types";
import { CAMPAIGN_STATUS_CONFIG } from "../constants/campaign-status";
import { fromStroops } from "@/utils/adjustedAmounts";

interface CampaignCardProps {
  campaign: Campaign;
  onClaimRoi?: (campaignId: string) => void;
}

export function CampaignCard({ campaign, onClaimRoi }: CampaignCardProps) {
  const { title, description, status, id, escrowId, poolSize } = campaign;
  const statusCfg = CAMPAIGN_STATUS_CONFIG[status];
  const escrowExplorerUrl = `https://stellar.expert/explorer/testnet/contract/${escrowId}`;

  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const { data: escrowData } = useQuery({
    queryKey: ["escrow", escrowId],
    queryFn: async () => {
      const data = (await getEscrowByContractIds({
        contractIds: [escrowId],
        validateOnChain: true,
      })) as { [key: string]: unknown }[] | undefined;
      return data?.[0] ?? null;
    },
    enabled: !!escrowId,
    staleTime: 1000 * 60 * 5,
  });

  const allMilestones = (escrowData?.milestones ?? []) as MultiReleaseMilestone[];
  const visibleMilestones = allMilestones.slice(1);
  const assigned = allMilestones.reduce(
    (sum, m) => sum + fromStroops((m.amount as number) ?? 0),
    0,
  );
  const loansCompleted = visibleMilestones.filter(
    (m) => m.status === "Approved",
  ).length;
  const totalLoans = visibleMilestones.length;
  const progressValue =
    totalLoans > 0 ? Math.min(100, (loansCompleted / totalLoans) * 100) : 0;

  return (
    <SharedCampaignCard
      title={`#${id.slice(0, 3).toUpperCase()} ${title}`}
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
            Claim ROI
          </Button>
        ) : null
      }
      footer={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">
            <span className="font-bold">Pool Size:</span> USDC{" "}
            {assigned.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}{" "}
            / USDC{" "}
            {poolSize.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      }
      progress={{ label: "Loans Completed", value: progressValue }}
    >
      {visibleMilestones.length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Loans
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
                  {m.description || `Loan ${i + 1}`}
                </span>
                <span className="ml-auto font-medium">{m.amount} USDC</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">No loans available.</p>
      )}
    </SharedCampaignCard>
  );
}

"use client";

import Link from "next/link";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
import { cn } from "@tokenization/shared/lib/utils";
import { Banknote, CheckCircle, Circle, ExternalLink, Rocket } from "lucide-react";
import type {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { InvestDialog } from "@/features/tokens/components/InvestDialog";
import { SelectedEscrowProvider } from "@/features/tokens/context/SelectedEscrowContext";
import { CAMPAIGN_STATUS_CONFIG } from "@/features/roi/constants/campaign-status";
import type { CampaignFromApi } from "./types";
import { fromStroops } from "@/utils/adjustedAmounts";

export type ProjectCardProps = {
  campaign: CampaignFromApi;
  escrow?: Escrow;
  isLoading?: boolean;
};

function getVisibleMilestones(escrow: Escrow | undefined): MultiReleaseMilestone[] {
  if (!escrow?.milestones) return [];
  return (escrow.milestones as MultiReleaseMilestone[]).slice(1);
}

function getLoansCompleted(escrow: Escrow | undefined): number {
  return getVisibleMilestones(escrow).filter((m) => m.status === "Approved").length;
}

function getTotalMilestones(escrow: Escrow | undefined): number {
  return getVisibleMilestones(escrow).length;
}

function getProgress(escrow: Escrow | undefined): number {
  const total = getTotalMilestones(escrow);
  if (total === 0) return 0;
  return Math.min((getLoansCompleted(escrow) / total) * 100, 100);
}

function LoadingSkeleton() {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        "shadow-card",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="flex items-end justify-between">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export const ProjectCard = ({
  campaign,
  escrow,
  isLoading = false,
}: ProjectCardProps) => {
  const { name, description, status, escrowId, tokenSaleId, tokenFactoryId } =
    campaign;
  const progress = getProgress(escrow);
  const statusCfg = CAMPAIGN_STATUS_CONFIG[status];
  const escrowExplorerUrl = `https://stellar.expert/explorer/testnet/contract/${escrowId}`;
  const milestones = (escrow?.milestones ?? []) as MultiReleaseMilestone[];
  const assigned = milestones.reduce((sum, m) => sum + fromStroops(m.amount ?? 0), 0);
  const poolSize = campaign.poolSize ?? 0;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <SharedCampaignCard
      title={`#${campaign.id.slice(0, 3).toUpperCase()} ${name}`}
      description={description || "No description"}
      statusBadge={
        <>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs font-semibold uppercase tracking-wide", statusCfg.className)}
            >
              {statusCfg.label}
            </Badge>

            <Button
              variant="ghost"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer p-2 h-auto"
              asChild
            >
              <Link href={escrowExplorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>
        </>
      }
      actions={
        tokenSaleId ? (
          <SelectedEscrowProvider
            value={{
              escrow,
              escrowId,
              tokenSaleContractId: tokenSaleId,
              tokenFactoryId: tokenFactoryId ?? undefined,
              campaignId: campaign.id,
            }}
          >
            <InvestDialog
              tokenSaleContractId={tokenSaleId}
              triggerLabel="Invest"
              expectedReturn={campaign.expectedReturn}
              loanDuration={campaign.loanDuration}
            />
          </SelectedEscrowProvider>
        ) : (
          <Button size="sm" className="cursor-pointer gap-1.5" disabled>
            <Rocket className="size-3.5" />
            Invest
          </Button>
        )
      }
      footer={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">
            <span className="font-bold">Pool Size:</span> USDC {assigned.toLocaleString("en-US", { minimumFractionDigits: 2 })} / USDC {poolSize.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      }
      progress={{ label: "Loans Completed", value: progress }}
    >
      {milestones.slice(1).length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Loans
          </p>
          <ul className="flex flex-col gap-1">
            {milestones.slice(1).map((m, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                {m.flags?.approved ? (
                  <CheckCircle className="size-3.5 text-green-500 shrink-0" />
                ) : m.flags?.released ? (
                  <Banknote className="size-3.5 text-blue-500 shrink-0" />
                ) : (
                  <Circle className="size-3.5 shrink-0" />
                )}
                <span className="truncate">{m.description || `Loan ${i + 1}`}</span>
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
};

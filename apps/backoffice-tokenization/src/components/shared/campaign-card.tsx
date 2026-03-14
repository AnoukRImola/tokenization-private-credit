"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
import { cn } from "@tokenization/shared/lib/utils";
import { Banknote, CheckCircle, Circle, ExternalLink, Landmark } from "lucide-react";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import type { Campaign } from "@/features/campaigns/types/campaign.types";
import { CAMPAIGN_STATUS_CONFIG } from "@/features/campaigns/constants/campaign-status";
import { formatCurrency } from "@tokenization/tw-blocks-shared/src/helpers/format.helper";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { id, name, description, status, escrowId } = campaign;

  const statusCfg = CAMPAIGN_STATUS_CONFIG[status];
  const isDraft = status === "DRAFT";
  const escrowExplorerUrl = `https://viewer.trustlesswork.com/${escrowId}`;

  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const { data: escrowData } = useQuery({
    queryKey: ["escrow", escrowId],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: async () => {
      const data = (await getEscrowByContractIds({
        contractIds: [escrowId],
        validateOnChain: true,
      })) as any;
      return data?.[0] ?? null;
    },
    enabled: !isDraft && !!escrowId,
    staleTime: 1000 * 60 * 5,
  });

  const allMilestones = (escrowData?.milestones ?? []) as MultiReleaseMilestone[];
  const visibleMilestones = allMilestones.slice(1);
  const totalLoans = visibleMilestones.length;

  return (
    <SharedCampaignCard
      title={name}
      description={description ?? ""}
      statusBadge={
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
            <Link
              href={escrowExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </div>
      }
      actions={
        !isDraft ? (
          <Button size="sm" className="cursor-pointer gap-1.5" asChild>
            <Link href={`/campaigns/loans/${escrowId}`}>
              <Landmark className="size-3.5" />
              Manejar Préstamos
            </Link>
          </Button>
        ) : undefined
      }
      footer={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">
            <span className="font-bold">Pool Size:</span> {formatCurrency(Number(escrowData?.balance ?? 0), "USDC")} / {formatCurrency(Number(campaign.poolSize), "USDC")}
          </span>
        </div>
      }
      stat={{ label: "Loans", value: totalLoans }}
    >
      {visibleMilestones.length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Loans
          </p>
          <ul className="flex flex-col gap-1">
            {visibleMilestones.map((m, i) => (
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
}

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
import { cn } from "@tokenization/shared/lib/utils";
import { Banknote, CheckCircle, Circle, Landmark } from "lucide-react";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import type { Campaign } from "@/features/campaigns/types/campaign.types";
import { getCampaignStatusConfig } from "@/features/campaigns/constants/campaign-status";
import { formatCurrency, fromStroops } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const t = useTranslations("campaigns");
  const { id, name, description, status, escrowId } = campaign;

  const statusCfg = getCampaignStatusConfig(t)[status];
  const isDraft = status === "DRAFT";

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
  const assigned = allMilestones.reduce((sum, m) => sum + fromStroops(m.amount ?? 0), 0);
  const loansCompleted = visibleMilestones.filter((m) => m.status === "Approved").length;
  const totalLoans = visibleMilestones.length;
  const progressValue = totalLoans > 0 ? Math.min(100, (loansCompleted / totalLoans) * 100) : 0;

  return (
    <SharedCampaignCard
      title={`#${id.slice(0, 3).toUpperCase()} ${name}`}
      description={description ?? ""}
      statusBadge={
        <Badge
          variant="outline"
          className={cn("text-xs font-semibold uppercase tracking-wide", statusCfg.className)}
        >
          {statusCfg.label}
        </Badge>
      }
      actions={
        !isDraft ? (
          <Button size="sm" className="cursor-pointer gap-1.5" asChild>
            <Link href={`/campaigns/loans/${escrowId}`}>
              <Landmark className="size-3.5" />
              {t("manageLoans")}
            </Link>
          </Button>
        ) : undefined
      }
      footer={
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground">
            <span className="font-bold">{t("poolSize")}:</span> USDC {formatCurrency(assigned)} / USDC {formatCurrency(campaign.poolSize)}
          </span>
        </div>
      }
      progress={{ label: t("loansCompleted"), value: progressValue }}
    >
      {visibleMilestones.length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {t("loans")}
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
                <span className="truncate">{m.description || t("loan", { index: i + 1 })}</span>
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

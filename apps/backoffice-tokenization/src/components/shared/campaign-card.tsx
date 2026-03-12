"use client";

import Link from "next/link";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { Progress } from "@tokenization/ui/progress";
import { cn } from "@tokenization/shared/lib/utils";
import { ExternalLink, Landmark } from "lucide-react";
import type { Campaign } from "@/features/campaigns/types/campaign.types";
import { CAMPAIGN_STATUS_CONFIG } from "@/features/campaigns/constants/campaign-status";
import { mapCampaignProgress } from "@/features/campaigns/utils/campaign.mapper";

interface CampaignCardProps {
  campaign: Campaign;
  location?: string;
  organization?: string;
  participants?: number;
  onSeeEscrow?: () => void;
}

export function CampaignCard({
  campaign,
  location,
  organization,
  participants = 0,
  onSeeEscrow,
}: CampaignCardProps) {
  const { title, description, status, targetAmount, raisedAmount, id } = campaign;

  const progress = mapCampaignProgress(campaign);

  const statusCfg = CAMPAIGN_STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        "shadow-card hover:shadow-hover",
        "transition-shadow duration-200"
      )}
    >
      {/* Top row: status + action */}
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn("text-xs font-semibold uppercase tracking-wide", statusCfg.className)}
        >
          {statusCfg.label}
        </Badge>

        <Button size="sm" className="cursor-pointer gap-1.5" asChild>
          <Link href={`/campaigns/${id}/loans`}>
            <Landmark className="size-3.5" />
            Manejar Préstamos
          </Link>
        </Button>
      </div>

      {/* Title & subtitle */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-lg font-bold text-foreground leading-tight">
          #{id.slice(0, 3).toUpperCase()} {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Bottom row: participants + escrow link | progress */}
      <div className="flex items-end justify-between gap-4 pt-1">
        {/* Participants + escrow */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onSeeEscrow}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            See Escrow
            <ExternalLink className="size-3" />
          </Button>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-1.5 min-w-40">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Loans Completed
            </span>
            <span className="text-xs font-bold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5 w-full" />
        </div>
      </div>
    </div>
  );
}

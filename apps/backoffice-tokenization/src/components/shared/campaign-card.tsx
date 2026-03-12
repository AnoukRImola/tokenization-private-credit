"use client";

import Link from "next/link";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { CampaignCard as SharedCampaignCard } from "@tokenization/ui/campaign-card";
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
  onSeeEscrow,
}: CampaignCardProps) {
  const { title, description, status, id } = campaign;
  const progress = mapCampaignProgress(campaign);
  const statusCfg = CAMPAIGN_STATUS_CONFIG[status];

  return (
    <SharedCampaignCard
      title={`#${id.slice(0, 3).toUpperCase()} ${title}`}
      description={description}
      statusBadge={
        <Badge
          variant="outline"
          className={cn("text-xs font-semibold uppercase tracking-wide", statusCfg.className)}
        >
          {statusCfg.label}
        </Badge>
      }
      actions={
        <Button size="sm" className="cursor-pointer gap-1.5" asChild>
          <Link href={`/campaigns/${id}/loans`}>
            <Landmark className="size-3.5" />
            Manejar Préstamos
          </Link>
        </Button>
      }
      footer={
        <Button
          variant="ghost"
          onClick={onSeeEscrow}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          See Escrow
          <ExternalLink className="size-3" />
        </Button>
      }
      progress={{ label: "Loans Completed", value: progress }}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@tokenization/ui/button";
import { ExternalLink } from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  truncate,
} from "../constants";
import type { Campaign } from "../types";

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

export function CampaignCard({
  campaign,
  index,
}: CampaignCardProps) {
  const router = useRouter();
  const statusColor =
    STATUS_COLORS[campaign.status] ??
    "text-muted-foreground border-muted-foreground/30";

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-mono">
              #{String(index + 1).padStart(3, "0")}
            </span>
            <h3 className="font-semibold text-base truncate">
              {campaign.name}
            </h3>
          </div>
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {campaign.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${statusColor}`}
          >
            {STATUS_LABELS[campaign.status] ?? campaign.status}
          </span>
          {campaign.escrowId && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-primary hover:text-primary gap-1 h-7 px-2"
              onClick={() =>
                router.push(
                  `/flow-testing/${campaign.escrowId}`,
                )
              }
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver Escrow
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-mono">
          {campaign.escrowId
            ? truncate(campaign.escrowId)
            : "Sin escrow"}
        </p>
        <Button
          size="sm"
          className="cursor-pointer h-8"
          onClick={() =>
            router.push(`/flow-testing/${campaign.escrowId}`)
          }
          disabled={!campaign.escrowId}
        >
          Añadir préstamo
        </Button>
      </div>
    </div>
  );
}

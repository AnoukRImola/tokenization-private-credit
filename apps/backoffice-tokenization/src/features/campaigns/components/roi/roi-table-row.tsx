"use client";

import Link from "next/link";
import { TableCell, TableRow } from "@tokenization/ui/table";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import { cn } from "@tokenization/shared/lib/utils";
import { ArrowUpCircle, Landmark } from "lucide-react";
import { CAMPAIGN_STATUS_CONFIG } from "@/features/campaigns/constants/campaign-status";
import { formatCurrency } from "@/lib/utils";
import type { RoiTableRowProps } from "./types";

export function RoiTableRow({ campaign, balance, onAddFunds }: RoiTableRowProps) {
  const statusCfg = CAMPAIGN_STATUS_CONFIG[campaign.status];

  return (
    <TableRow className="border-border hover:bg-secondary/30 transition-colors">
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground">{campaign.name}</span>
          <span className="text-xs text-text-muted line-clamp-1 max-w-xs">
            {campaign.description}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-semibold text-foreground">
          ${formatCurrency(balance)}
        </span>
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            statusCfg.className
          )}
        >
          {statusCfg.label}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer text-primary hover:text-primary/80 gap-1 text-xs font-semibold"
            asChild
          >
            <Link href={`/campaigns/loans/${campaign.escrowId}`}>
              <Landmark className="size-3.5" />
              Gestionar Préstamos
            </Link>
          </Button>
          <Button
            size="sm"
            className="cursor-pointer gap-1 text-xs"
            onClick={() => onAddFunds(campaign)}
          >
            <ArrowUpCircle className="size-3.5" />
            Subir Fondos
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

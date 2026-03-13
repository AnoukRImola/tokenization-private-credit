"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TableCell, TableRow } from "@tokenization/ui/table";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@tokenization/ui/dropdown-menu";
import { cn } from "@tokenization/shared/lib/utils";
import { ArrowUpCircle, Landmark, MoreHorizontal, Percent } from "lucide-react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { CAMPAIGN_STATUS_CONFIG } from "@/features/campaigns/constants/campaign-status";
import { formatCurrency } from "@/lib/utils";
import { getVaultIsEnabled } from "@/features/campaigns/services/campaigns.api";
import { useVaultUsdcBalance } from "@/features/campaigns/hooks/useVaultUsdcBalance";
import { ToggleVaultButton } from "@/features/campaigns/components/roi/ToggleVaultButton";
import type { RoiTableRowProps } from "./types";

export function RoiTableRow({ campaign, onAddFunds, onUpdateRoi }: RoiTableRowProps) {
  const statusCfg = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const { walletAddress } = useWalletContext();
  const [vaultEnabled, setVaultEnabled] = useState<boolean | null>(null);
  const { balance } = useVaultUsdcBalance(campaign.vaultId);

  useEffect(() => {
    if (!campaign.vaultId || !walletAddress) return;
    getVaultIsEnabled(campaign.vaultId, walletAddress)
      .then(({ enabled }) => setVaultEnabled(enabled))
      .catch(() => setVaultEnabled(null));
  }, [campaign.vaultId, walletAddress]);

  const handleToggled = (newEnabled: boolean) => {
    setVaultEnabled(newEnabled);
  };

  return (
    <TableRow className="border-border hover:bg-secondary/30 transition-colors">
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {campaign.name}
          </span>
          <span className="text-xs text-text-muted overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
            {campaign.description}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-semibold text-foreground">
          ${formatCurrency(Number(balance) / 10_000_000, 2)}
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
        <div className="flex items-center justify-end gap-1.5">
          {campaign.vaultId && (
            <ToggleVaultButton
              vaultId={campaign.vaultId}
              currentlyEnabled={vaultEnabled}
              campaignId={campaign.id}
              onToggled={handleToggled}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer h-8 w-8 p-0"
                aria-label="Actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/campaigns/loans/${campaign.escrowId}`}>
                  <Landmark className="size-3.5" />
                  Gestionar Préstamos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onAddFunds(campaign)}
              >
                <ArrowUpCircle className="size-3.5" />
                Subir Fondos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onUpdateRoi(campaign)}
              >
                <Percent className="size-3.5" />
                Actualizar ROI
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

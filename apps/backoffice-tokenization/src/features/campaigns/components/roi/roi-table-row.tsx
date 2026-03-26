"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
import { getContractExplorerUrl } from "@tokenization/shared/lib/constants";
import { ArrowUpCircle, Landmark, MoreHorizontal, Percent, Vault } from "lucide-react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { getCampaignStatusConfig } from "@tokenization/shared";
import { formatCurrency } from "@tokenization/tw-blocks-shared/src/helpers/format.helper";
import { getVaultIsEnabled } from "@/features/campaigns/services/campaigns.api";
import { useVaultUsdcBalance } from "@/features/campaigns/hooks/useVaultUsdcBalance";
import { ToggleVaultButton } from "@/features/campaigns/components/roi/ToggleVaultButton";
import type { RoiTableRowProps } from "./types";

export function RoiTableRow({ campaign, onAddFunds, onUpdateRoi }: RoiTableRowProps) {
  const t = useTranslations("roi");
  const tCampaigns = useTranslations("campaigns");
  const statusCfg = getCampaignStatusConfig(tCampaigns)[campaign.status];
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
      <TableCell className="max-w-[200px]">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-foreground">
            {campaign.name}
          </span>
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs text-text-muted">
            {campaign.description}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm font-semibold text-foreground">
          {formatCurrency(Number(balance) / 10_000_000, "USDC")}
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
                aria-label={t("actions")}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {campaign.vaultId && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={getContractExplorerUrl(campaign.vaultId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Vault className="size-3.5" />
                    {t("viewVault")}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/campaigns/loans/${campaign.escrowId}`}>
                  <Landmark className="size-3.5" />
                  {t("manageLoans")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onAddFunds(campaign)}
              >
                <ArrowUpCircle className="size-3.5" />
                {t("uploadFunds")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onUpdateRoi(campaign)}
              >
                <Percent className="size-3.5" />
                {t("updateRoi")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

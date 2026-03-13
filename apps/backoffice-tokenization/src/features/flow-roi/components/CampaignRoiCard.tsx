"use client";

import { useState } from "react";
import { Button } from "@tokenization/ui/button";
import { truncate } from "@/features/flow-testing/constants";
import { STATUS_LABELS, STATUS_COLORS } from "@/features/flow-testing/constants";
import { CreateRoiDialog } from "./CreateRoiDialog";
import { FundRoiDialog } from "./FundRoiDialog";
import { VaultInfoPanel } from "./VaultInfoPanel";
import { ToggleVaultButton } from "./ToggleVaultButton";
import { useVaultInfo } from "../hooks/useVaultInfo";
import type { Campaign } from "../types";

interface CampaignRoiCardProps {
  campaign: Campaign;
  index: number;
  onUpdated: () => void;
}

export function CampaignRoiCard({
  campaign,
  index,
  onUpdated,
}: CampaignRoiCardProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [enabledOverride, setEnabledOverride] = useState<boolean | null>(null);

  const statusColor =
    STATUS_COLORS[campaign.status] ??
    "text-muted-foreground border-muted-foreground/30";

  const hasTokenFactory = !!campaign.tokenFactoryId;
  const hasVault = !!campaign.vaultId;

  const { info: vaultInfo, loading: vaultLoading } = useVaultInfo(
    campaign.vaultId ?? "",
    refreshKey,
  );

  const handleToggle = (newEnabled: boolean) => {
    setEnabledOverride(newEnabled);
    setRefreshKey((k) => k + 1);
    onUpdated();
  };

  return (
    <>
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

          <span
            className={`text-xs border rounded-full px-2.5 py-0.5 font-medium flex-shrink-0 ${statusColor}`}
          >
            {STATUS_LABELS[campaign.status] ?? campaign.status}
          </span>
        </div>

        {hasVault && campaign.vaultId ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-mono">
              Vault: {truncate(campaign.vaultId)}
            </p>
            <VaultInfoPanel info={vaultInfo} loading={vaultLoading} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No vault deployed</p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
          {!hasVault && hasTokenFactory ? (
            <Button
              size="sm"
              className="cursor-pointer h-8"
              onClick={() => setCreateOpen(true)}
            >
              Create ROI
            </Button>
          ) : null}

          {hasVault ? (
            <>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer h-8"
                onClick={() => setFundOpen(true)}
              >
                Fund ROI
              </Button>
              <ToggleVaultButton
                vaultId={campaign.vaultId!}
                currentlyEnabled={enabledOverride !== null ? enabledOverride : (vaultInfo?.enabled ?? null)}
                campaignId={campaign.id}
                onToggled={handleToggle}
              />
            </>
          ) : null}

          {!hasTokenFactory ? (
            <p className="text-xs text-muted-foreground">
              Token Factory required to create vault
            </p>
          ) : null}
        </div>
      </div>

      {hasTokenFactory && campaign.tokenFactoryId && !hasVault ? (
        <CreateRoiDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          campaignId={campaign.id}
          campaignName={campaign.name}
          tokenFactoryId={campaign.tokenFactoryId}
          onCreated={() => {
            onUpdated();
          }}
        />
      ) : null}

      {hasVault && campaign.vaultId ? (
        <FundRoiDialog
          open={fundOpen}
          onOpenChange={setFundOpen}
          campaignName={campaign.name}
          vaultId={campaign.vaultId}
          onFunded={handleRefresh}
        />
      ) : null}
    </>
  );
}

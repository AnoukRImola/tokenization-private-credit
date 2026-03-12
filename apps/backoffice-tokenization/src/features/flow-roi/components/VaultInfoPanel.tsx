"use client";

import { Loader2 } from "lucide-react";
import type { VaultInfo } from "../types";

interface VaultInfoPanelProps {
  info: VaultInfo | null;
  loading: boolean;
}

export function VaultInfoPanel({ info, loading }: VaultInfoPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading vault...
      </div>
    );
  }

  if (!info) {
    return (
      <p className="text-xs text-muted-foreground">
        Vault info unavailable
      </p>
    );
  }

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span>
        Status:{" "}
        <span
          className={
            info.enabled
              ? "text-green-400 font-medium"
              : "text-yellow-400 font-medium"
          }
        >
          {info.enabled ? "Enabled" : "Disabled"}
        </span>
      </span>
      <span>
        ROI: <span className="font-medium text-foreground">{info.roiPercentage}%</span>
      </span>
      <span>
        USDC Balance:{" "}
        <span className="font-medium text-foreground">{info.usdcBalance}</span>
      </span>
    </div>
  );
}

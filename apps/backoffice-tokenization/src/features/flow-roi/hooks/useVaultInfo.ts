"use client";

import { useEffect, useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import {
  getVaultIsEnabled,
  getVaultUsdcBalance,
  getVaultRoiPercentage,
} from "../services/roi.service";
import type { VaultInfo } from "../types";

export function useVaultInfo(vaultId: string, refreshKey?: number) {
  const { walletAddress } = useWalletContext();
  const [info, setInfo] = useState<VaultInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress || !vaultId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      getVaultIsEnabled(vaultId, walletAddress).catch(() => null),
      getVaultUsdcBalance(vaultId, walletAddress).catch(() => null),
      getVaultRoiPercentage(vaultId, walletAddress).catch(() => null),
    ])
      .then(([enabledRes, balanceRes, roiRes]) => {
        if (enabledRes || balanceRes || roiRes) {
          setInfo({
            enabled: enabledRes?.enabled ?? false,
            usdcBalance: balanceRes?.balance ?? "—",
            roiPercentage: roiRes?.roiPercentage ?? "—",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [vaultId, walletAddress, refreshKey]);

  return { info, loading };
}

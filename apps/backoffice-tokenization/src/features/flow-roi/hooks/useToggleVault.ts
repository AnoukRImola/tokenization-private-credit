"use client";

import { useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { submitAndExtractAddress } from "@/features/flow-testing/services/soroban.service";
import { enableVault } from "../services/roi.service";
import { updateCampaignStatus } from "@/features/campaigns/services/campaigns.api";

interface UseToggleVaultParams {
  onSuccess?: (newEnabled: boolean) => void;
}

export function useToggleVault({ onSuccess }: UseToggleVaultParams = {}) {
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (vaultContractId: string, enabled: boolean, campaignId?: string) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { unsignedXdr } = await enableVault({
        contractId: vaultContractId,
        admin: walletAddress,
        enabled,
        callerPublicKey: walletAddress,
      });

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress,
      });

      await submitAndExtractAddress(signedXdr);

      if (enabled && campaignId) {
        await updateCampaignStatus(campaignId, "CLAIMABLE").catch(() => null);
      }

      onSuccess?.(enabled);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error };
}

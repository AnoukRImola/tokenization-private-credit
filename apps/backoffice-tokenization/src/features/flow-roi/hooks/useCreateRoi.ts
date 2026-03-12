"use client";

import { useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { submitAndExtractAddress } from "@/features/flow-testing/services/soroban.service";
import {
  deployVault,
  updateCampaignVaultId,
} from "../services/roi.service";
import { USDC_TESTNET_ADDRESS } from "@/features/flow-testing/constants";

interface UseCreateRoiParams {
  campaignId: string;
  tokenFactoryId: string;
  onSuccess?: (vaultContractId: string) => void;
}

export function useCreateRoi({
  campaignId,
  tokenFactoryId,
  onSuccess,
}: UseCreateRoiParams) {
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (roiPercentage: number) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { unsignedXdr } = await deployVault({
        admin: walletAddress,
        enabled: false,
        roiPercentage,
        token: tokenFactoryId,
        usdc: USDC_TESTNET_ADDRESS,
        callerPublicKey: walletAddress,
      });

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress,
      });

      const vaultContractId = await submitAndExtractAddress(signedXdr);

      if (!vaultContractId) {
        throw new Error("Could not extract vault contract address from transaction");
      }

      await updateCampaignVaultId(campaignId, vaultContractId);

      onSuccess?.(vaultContractId);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error };
}

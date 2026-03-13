"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { submitAndExtractAddress } from "@/features/campaigns/services/soroban.service";
import { updateRoiPorcentage } from "@/features/campaigns/services/campaigns.api";

interface UseUpdateRoiPercentageParams {
  onSuccess?: () => void;
}

export function useUpdateRoiPercentage({ onSuccess }: UseUpdateRoiPercentageParams = {}) {
  const { walletAddress } = useWalletContext();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (vaultContractId: string, newRoiPorcentage: number) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { unsignedXdr } = await updateRoiPorcentage({
        contractId: vaultContractId,
        newRoiPorcentage,
        callerPublicKey: walletAddress,
      });

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress,
      });

      await submitAndExtractAddress(signedXdr);

      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });

      onSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error };
}

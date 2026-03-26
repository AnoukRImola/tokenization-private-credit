"use client";

import { useState, useCallback, useMemo } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { ClaimROIService } from "@/features/claim-roi/services/claim.service";
import { SendTransactionService } from "@tokenization/shared/lib/sendTransactionService";
import { toastSuccessWithTx } from "@tokenization/ui/toast-with-tx";
import { toast } from "sonner";

export type ClaimROIMessages = {
  noVault: string;
  connectWallet: string;
  buildFailed: string;
  claimFailed: string;
  success: string;
  unexpectedError: string;
};

const DEFAULT_MESSAGES: ClaimROIMessages = {
  noVault: "No vault available for this campaign",
  connectWallet: "Connect your wallet to claim",
  buildFailed: "Failed to build claim transaction",
  claimFailed: "Claim failed",
  success: "ROI claimed successfully",
  unexpectedError: "Unexpected error",
};

export function useClaimROI(messages?: Partial<ClaimROIMessages>) {
  const { walletAddress } = useWalletContext();
  const [isClaiming, setIsClaiming] = useState(false);

  const msgs = useMemo(
    () => ({ ...DEFAULT_MESSAGES, ...messages }),
    [messages],
  );

  const claimROI = useCallback(
    async (params: { vaultContractId: string }) => {
      const { vaultContractId } = params;

      if (!vaultContractId) {
        toast.error(msgs.noVault);
        return;
      }

      if (!walletAddress) {
        toast.error(msgs.connectWallet);
        return;
      }

      setIsClaiming(true);
      try {
        const svc = new ClaimROIService();
        const claimResponse = await svc.claimROI({
          vaultContractId,
          beneficiaryAddress: walletAddress,
        });

        if (!claimResponse?.success || !claimResponse?.xdr) {
          throw new Error(claimResponse?.message ?? msgs.buildFailed);
        }

        const signedTxXdr = await signTransaction({
          unsignedTransaction: claimResponse.xdr,
          address: walletAddress,
        });

        const sender = new SendTransactionService({
          baseURL: process.env.NEXT_PUBLIC_CORE_API_URL,
          apiKey: process.env.NEXT_PUBLIC_INVESTORS_API_KEY,
        });
        const submitResponse = await sender.sendTransaction({
          signedXdr: signedTxXdr,
        });

        if (submitResponse.status !== "SUCCESS") {
          throw new Error(
            submitResponse.message ?? msgs.claimFailed,
          );
        }

        toastSuccessWithTx(msgs.success, submitResponse.hash);
      } catch (e) {
        const msg = e instanceof Error ? e.message : msgs.unexpectedError;
        toast.error(msg);
      } finally {
        setIsClaiming(false);
      }
    },
    [walletAddress, msgs],
  );

  return { claimROI, isClaiming };
}

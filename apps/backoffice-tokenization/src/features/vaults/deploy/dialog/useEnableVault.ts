import * as React from "react";
import { useForm } from "react-hook-form";
import {
  VaultService,
  type EnableVaultResponse,
} from "@/features/vaults/services/vault.service";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { SendTransactionService } from "@tokenization/shared/lib/sendTransactionService";
import { toastSuccessWithTx } from "@tokenization/ui/toast-with-tx";
import { updateCampaignStatusByVaultId } from "@/features/campaigns/services/campaigns.api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export type EnableVaultFormValues = {
  vaultContractAddress: string;
};

type UseEnableVaultParams = {
  onSuccess?: (response: EnableVaultResponse) => void;
};

export function useEnableVault(params?: UseEnableVaultParams) {
  const t = useTranslations("vaults");
  const { walletAddress } = useWalletContext();
  const queryClient = useQueryClient();

  const form = useForm<EnableVaultFormValues>({
    defaultValues: {
      vaultContractAddress: "",
    },
    mode: "onSubmit",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [response, setResponse] = React.useState<EnableVaultResponse | null>(
    null
  );

  const onSubmit = async (values: EnableVaultFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const vaultService = new VaultService();
      const enableResponse = await vaultService.enableVault({
        vaultContractId: values.vaultContractAddress,
        adminAddress: walletAddress ?? "",
      });

      if (!enableResponse?.success || !enableResponse?.xdr) {
        throw new Error(t("errors.failedBuildEnableTx"));
      }

      const signedTxXdr = await signTransaction({
        unsignedTransaction: enableResponse.xdr ?? "",
        address: walletAddress ?? "",
      });

      const sender = new SendTransactionService();
      const submitResponse = await sender.sendTransaction({
        signedXdr: signedTxXdr,
      });

      if (submitResponse.status !== "SUCCESS") {
        throw new Error(t("errors.transactionSubmissionFailed"));
      }

      toastSuccessWithTx(t("enableVaultSuccessToast"), submitResponse.hash);

      try {
        await updateCampaignStatusByVaultId(
          values.vaultContractAddress,
          "CLAIMABLE",
        );
        await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      } catch {
        // Campaign may not exist or vaultId not linked; status update is best-effort
      }

      setResponse(enableResponse);

      if (enableResponse?.success) {
        params?.onSuccess?.(enableResponse);
      } else {
        setError(t("errors.enableVaultRequestFailed"));
      }
    } catch (e) {
      if (!(e instanceof Error)) {
        setError(t("errors.unexpectedError"));
        return;
      }

      const failedBuildEnableTxMessage = t("errors.failedBuildEnableTx");
      const transactionSubmissionFailedMessage = t("errors.transactionSubmissionFailed");
      const enableVaultRequestFailedMessage = t("errors.enableVaultRequestFailed");

      if (
        e.message === failedBuildEnableTxMessage ||
        e.message === transactionSubmissionFailedMessage ||
        e.message === enableVaultRequestFailedMessage
      ) {
        setError(e.message);
        return;
      }

      setError(t("errors.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    isSubmitting,
    error,
    response,
    setResponse,
    handleSubmit,
  };
}

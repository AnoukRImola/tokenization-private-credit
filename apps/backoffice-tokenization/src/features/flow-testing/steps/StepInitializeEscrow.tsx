"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@tokenization/ui/button";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { useEscrowsMutations } from "@tokenization/tw-blocks-shared/src/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@tokenization/tw-blocks-shared/src/handle-errors/handle";
import { useCampaignFlow } from "../hooks/useCampaignFlow";
import { USDC_TESTNET_ADDRESS, slugify } from "../constants";
import { InitializeMultiReleaseEscrowPayload } from "@trustless-work/escrow/types";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function StepInitializeEscrow({
  onNext,
}: {
  onNext?: () => void;
}) {
  const { walletAddress } = useWalletContext();
  const { deployEscrow } = useEscrowsMutations();
  const { getState, update } = useCampaignFlow();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [contractId, setContractId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const hasTriggered = useRef(false);

  const initializeEscrow = async () => {
    const campaign = getState().campaign;
    if (!campaign || !walletAddress) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const currentYear = new Date().getFullYear();
      const engagementId = `interactuar-${currentYear}-${slugify(campaign.name)}`;

      const payload: InitializeMultiReleaseEscrowPayload = {
        title: campaign.name,
        engagementId,
        description: campaign.description,
        platformFee: 0,
        trustline: {
          address: USDC_TESTNET_ADDRESS,
          symbol: "USDC",
        },
        roles: {
          approver: walletAddress,
          serviceProvider: walletAddress,
          platformAddress: walletAddress,
          releaseSigner: walletAddress,
          disputeResolver: walletAddress,
        },
        milestones: [
          {
            receiver: walletAddress,
            description: "Ganancia",
            amount: 1,
          },
        ],
        signer: walletAddress,
      };

      const response = await deployEscrow.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress,
      });

      const id = (response as { contractId?: string })
        ?.contractId;
      if (id) {
        update({ contractId: id });
        setContractId(id);
      }
      setStatus("success");
    } catch (error) {
      const { message } = handleError(error as ErrorResponse);
      setErrorMessage(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    initializeEscrow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    hasTriggered.current = false;
    initializeEscrow();
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">
          Inicializando escrow...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-destructive">
          Error al inicializar escrow
        </p>
        {errorMessage && (
          <p className="text-sm text-muted-foreground max-w-md text-center">
            {errorMessage}
          </p>
        )}
        <Button
          onClick={handleRetry}
          className="cursor-pointer mt-2"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <CheckCircle2 className="h-12 w-12 text-green-500" />
      <p className="text-lg font-semibold">
        Escrow inicializado exitosamente
      </p>
      {contractId && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-muted-foreground">
            Contract ID:
          </p>
          <code className="text-sm bg-muted px-3 py-1 rounded break-all max-w-md text-center">
            {contractId}
          </code>
        </div>
      )}
      {onNext && (
        <Button
          onClick={onNext}
          className="cursor-pointer mt-4"
        >
          Continuar
        </Button>
      )}
    </div>
  );
}

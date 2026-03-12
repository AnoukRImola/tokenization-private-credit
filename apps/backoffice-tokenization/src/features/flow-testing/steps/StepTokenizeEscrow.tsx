"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@tokenization/ui/button";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { useCampaignFlow } from "../hooks/useCampaignFlow";
import { PhaseStatusRow } from "../components/PhaseStatusRow";
import {
  deployTokenFactory,
  deployParticipationToken,
  setAdmin,
  createCampaign,
} from "../services/campaign.service";
import { submitAndExtractAddress } from "../services/soroban.service";
import {
  TOKENIZE_PHASE_LABELS,
  slugToSymbol,
} from "../constants";
import type { PhaseStatus, PhaseState } from "../types";

export function StepTokenizeEscrow() {
  const router = useRouter();
  const { walletAddress } = useWalletContext();
  const { getState, update } = useCampaignFlow();

  const [phases, setPhases] = useState<PhaseState[]>(
    TOKENIZE_PHASE_LABELS.map(() => ({
      status: "idle" as PhaseStatus,
      error: "",
    })),
  );
  const [failedAt, setFailedAt] = useState<number | null>(null);

  const tokenFactoryIdRef = useRef<string | null>(null);
  const tokenSaleIdRef = useRef<string | null>(null);
  const hasTriggered = useRef(false);

  const setPhaseStatus = (
    index: number,
    status: PhaseStatus,
    error = "",
  ) => {
    setPhases((prev) =>
      prev.map((p, i) =>
        i === index ? { status, error } : p,
      ),
    );
  };

  const runFlow = async (startFrom = 0) => {
    const state = getState();
    const { campaign, contractId: escrowId } = state;
    if (!campaign || !escrowId || !walletAddress) return;

    // Seed refs from persisted state when resuming after failure
    if (startFrom > 0) {
      tokenFactoryIdRef.current = state.tokenFactoryId;
      tokenSaleIdRef.current = state.tokenSaleId;
    }

    setFailedAt(null);
    let currentPhase = startFrom;

    try {
      if (startFrom <= 0) {
        currentPhase = 0;
        setPhaseStatus(0, "loading");
        const { unsignedXdr: tfXdr } = await deployTokenFactory({
          name: campaign.name,
          symbol: slugToSymbol(campaign.name),
          escrowContractId: escrowId,
          mintAuthority: walletAddress,
          callerPublicKey: walletAddress,
        });
        const signedTfXdr = await signTransaction({
          unsignedTransaction: tfXdr,
          address: walletAddress,
        });
        const tfContractId =
          await submitAndExtractAddress(signedTfXdr);
        if (!tfContractId) {
          throw new Error(
            "El despliegue del Token Factory no retornó un contract ID",
          );
        }
        tokenFactoryIdRef.current = tfContractId;
        update({ tokenFactoryId: tfContractId });
        setPhaseStatus(0, "success");
      }

      if (startFrom <= 1) {
        currentPhase = 1;
        setPhaseStatus(1, "loading");
        const { unsignedXdr: ptXdr } =
          await deployParticipationToken({
            escrowContractId: escrowId,
            callerPublicKey: walletAddress,
          });
        const signedPtXdr = await signTransaction({
          unsignedTransaction: ptXdr,
          address: walletAddress,
        });
        const ptContractId =
          await submitAndExtractAddress(signedPtXdr);
        if (!ptContractId) {
          throw new Error(
            "El despliegue del Token de Participación no retornó un contract ID",
          );
        }
        tokenSaleIdRef.current = ptContractId;
        update({ tokenSaleId: ptContractId });
        setPhaseStatus(1, "success");
      }

      if (startFrom <= 2) {
        currentPhase = 2;
        setPhaseStatus(2, "loading");
        const { unsignedXdr: saXdr } = await setAdmin({
          tokenFactoryContractId:
            tokenFactoryIdRef.current!,
          newAdmin: tokenSaleIdRef.current!,
          callerPublicKey: walletAddress,
        });
        const signedSaXdr = await signTransaction({
          unsignedTransaction: saXdr,
          address: walletAddress,
        });
        await submitAndExtractAddress(signedSaXdr);
        setPhaseStatus(2, "success");
      }

      if (startFrom <= 3) {
        currentPhase = 3;
        setPhaseStatus(3, "loading");
        const created = await createCampaign({
          campaign,
          issuerAddress: walletAddress,
          escrowId,
          tokenFactoryId: tokenFactoryIdRef.current!,
          tokenSaleId: tokenSaleIdRef.current!,
        });
        update({ campaignDbId: created.id });
        setPhaseStatus(3, "success");

        setTimeout(() => {
          router.push(`/flow-testing/${escrowId}`);
        }, 1500);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      setPhaseStatus(currentPhase, "error", message);
      setFailedAt(currentPhase);
    }
  };

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    runFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    if (failedAt === null) return;
    if (failedAt === 0) {
      tokenFactoryIdRef.current = null;
      tokenSaleIdRef.current = null;
    } else if (failedAt === 1) {
      tokenSaleIdRef.current = null;
    }
    setPhases((prev) =>
      prev.map((p, i) =>
        i >= failedAt
          ? { status: "idle" as PhaseStatus, error: "" }
          : p,
      ),
    );
    hasTriggered.current = false;
    runFlow(failedAt);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h2 className="text-xl font-semibold">
        Tokenizando campaña
      </h2>
      <div className="flex flex-col gap-3 w-full max-w-md">
        {phases.map((phase, index) => (
          <PhaseStatusRow
            key={index}
            label={TOKENIZE_PHASE_LABELS[index]!}
            status={phase.status}
            error={phase.error}
          />
        ))}
      </div>
      {failedAt !== null && (
        <Button
          onClick={handleRetry}
          className="cursor-pointer"
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}

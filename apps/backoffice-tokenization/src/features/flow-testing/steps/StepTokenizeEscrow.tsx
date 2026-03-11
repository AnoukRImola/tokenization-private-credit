"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@tokenization/ui/button";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { useCampaignFlow } from "../hooks/useCampaignFlow";
import { CheckCircle2, XCircle, Loader2, Circle } from "lucide-react";

type PhaseStatus = "idle" | "loading" | "success" | "error";

interface PhaseState {
  status: PhaseStatus;
  error: string;
}

const PHASE_LABELS = [
  "Desplegar Token Factory",
  "Desplegar Token de Participación",
  "Configurar Administrador",
  "Crear Campaña",
];

const CORE_API =
  process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:4000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CORE_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Error ${res.status} en ${path}`);
  }
  return res.json() as Promise<T>;
}

function slugToSymbol(name: string): string {
  return name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "TKN";
}

export function StepTokenizeEscrow() {
  const router = useRouter();
  const { walletAddress } = useWalletContext();
  const {
    getCampaign,
    getContractId,
    saveTokenFactoryId,
    saveTokenSaleId,
    saveCampaignDbId,
  } = useCampaignFlow();

  const [phases, setPhases] = useState<PhaseState[]>(
    PHASE_LABELS.map(() => ({ status: "idle" as PhaseStatus, error: "" })),
  );
  const [failedAt, setFailedAt] = useState<number | null>(null);

  const tokenFactoryIdRef = useRef<string | null>(null);
  const tokenSaleIdRef = useRef<string | null>(null);
  const hasTriggered = useRef(false);

  const setPhaseStatus = (index: number, status: PhaseStatus, error = "") => {
    setPhases((prev) =>
      prev.map((p, i) => (i === index ? { status, error } : p)),
    );
  };

  const runFlow = async (startFrom = 0) => {
    const campaign = getCampaign();
    const escrowId = getContractId();
    if (!campaign || !escrowId || !walletAddress) return;

    setFailedAt(null);
    let currentPhase = startFrom;

    try {
      if (startFrom <= 0) {
        currentPhase = 0;
        setPhaseStatus(0, "loading");
        const { unsignedXdr: tfXdr } = await post<{ unsignedXdr: string }>(
          "/deploy/token-factory",
          {
            name: campaign.name,
            symbol: slugToSymbol(campaign.name),
            escrowContractId: escrowId,
            mintAuthority: walletAddress,
            callerPublicKey: walletAddress,
          },
        );
        const signedTfXdr = await signTransaction({
          unsignedTransaction: tfXdr,
          address: walletAddress,
        });
        const tfResult = await post<{ contractId: string | null }>(
          "/soroban/submit-transaction",
          { signedXdr: signedTfXdr },
        );
        if (!tfResult.contractId) {
          throw new Error(
            "El despliegue del Token Factory no retornó un contract ID",
          );
        }
        tokenFactoryIdRef.current = tfResult.contractId;
        saveTokenFactoryId(tfResult.contractId);
        setPhaseStatus(0, "success");
      }

      if (startFrom <= 1) {
        currentPhase = 1;
        setPhaseStatus(1, "loading");
        const { unsignedXdr: ptXdr } = await post<{ unsignedXdr: string }>(
          "/deploy/participation-token",
          { escrowContractId: escrowId, callerPublicKey: walletAddress },
        );
        const signedPtXdr = await signTransaction({
          unsignedTransaction: ptXdr,
          address: walletAddress,
        });
        const ptResult = await post<{ contractId: string | null }>(
          "/soroban/submit-transaction",
          { signedXdr: signedPtXdr },
        );
        if (!ptResult.contractId) {
          throw new Error(
            "El despliegue del Token de Participación no retornó un contract ID",
          );
        }
        tokenSaleIdRef.current = ptResult.contractId;
        saveTokenSaleId(ptResult.contractId);
        setPhaseStatus(1, "success");
      }

      if (startFrom <= 2) {
        currentPhase = 2;
        setPhaseStatus(2, "loading");
        const { unsignedXdr: saXdr } = await post<{ unsignedXdr: string }>(
          "/deploy/set-admin",
          {
            tokenFactoryContractId: tokenFactoryIdRef.current!,
            newAdmin: tokenSaleIdRef.current!,
            callerPublicKey: walletAddress,
          },
        );
        const signedSaXdr = await signTransaction({
          unsignedTransaction: saXdr,
          address: walletAddress,
        });
        await post("/soroban/submit-transaction", { signedXdr: signedSaXdr });
        setPhaseStatus(2, "success");
      }

      if (startFrom <= 3) {
        currentPhase = 3;
        setPhaseStatus(3, "loading");
        const created = await post<{ id: string }>(
          "/campaigns",
          {
            name: campaign.name,
            description: campaign.description,
            issuerAddress: walletAddress,
            escrowId,
            poolSize: campaign.poolSize,
            loanDuration: campaign.loanDuration,
            expectedReturn: campaign.expectedReturn,
            loanSize: campaign.loanSize,
            tokenFactoryId: tokenFactoryIdRef.current!,
            tokenSaleId: tokenSaleIdRef.current!,
          },
        );
        saveCampaignDbId(created.id);
        setPhaseStatus(3, "success");

        setTimeout(() => {
          router.push(`/flow-testing/${escrowId}`);
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
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
        i >= failedAt ? { status: "idle" as PhaseStatus, error: "" } : p,
      ),
    );
    hasTriggered.current = false;
    runFlow(failedAt);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h2 className="text-xl font-semibold">Tokenizando campaña</h2>
      <div className="flex flex-col gap-3 w-full max-w-md">
        {phases.map((phase, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg border"
          >
            <div className="flex-shrink-0 mt-0.5">
              {phase.status === "loading" && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              {phase.status === "success" && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {phase.status === "error" && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {phase.status === "idle" && (
                <Circle className="h-5 w-5 text-muted-foreground/30" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <span
                className={`text-sm font-medium ${
                  phase.status === "idle" ? "text-muted-foreground/50" : ""
                }`}
              >
                {PHASE_LABELS[index]}
              </span>
              {phase.error && (
                <span className="text-xs text-destructive mt-1">
                  {phase.error}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {failedAt !== null && (
        <Button onClick={handleRetry} className="cursor-pointer">
          Reintentar
        </Button>
      )}
    </div>
  );
}

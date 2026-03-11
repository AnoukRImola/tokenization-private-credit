"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@tokenization/ui/button";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { useEscrowsMutations } from "@tokenization/tw-blocks-shared/src/tanstack/useEscrowsMutations";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import {
  GetEscrowsFromIndexerResponse,
  MultiReleaseMilestone,
  MultiReleaseReleaseFundsPayload,
  ChangeMilestoneStatusPayload,
} from "@trustless-work/escrow/types";
import {
  ErrorResponse,
  handleError,
} from "@tokenization/tw-blocks-shared/src/handle-errors/handle";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddLoanDialog } from "./AddLoanDialog";

interface EscrowDetailProps {
  contractId: string;
}

export function EscrowDetail({ contractId }: EscrowDetailProps) {
  const { walletAddress } = useWalletContext();
  const { releaseFunds, changeMilestoneStatus } = useEscrowsMutations();
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();
  const router = useRouter();

  const [escrow, setEscrow] = useState<GetEscrowsFromIndexerResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releasingIndex, setReleasingIndex] = useState<number | null>(null);
  const [addLoanOpen, setAddLoanOpen] = useState(false);

  const fetchEscrow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await getEscrowByContractIds({
        contractIds: [contractId],
        validateOnChain: true,
      })) as any;

      if (!data || !data[0]) {
        throw new Error("Escrow no encontrado");
      }
      setEscrow(data[0]);
    } catch (err) {
      const { message } = handleError(err as ErrorResponse);
      setError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  useEffect(() => {
    fetchEscrow();
  }, [fetchEscrow]);

  const handleComplete = async (milestoneIndex: number) => {
    if (!walletAddress || !escrow?.contractId) return;

    setReleasingIndex(milestoneIndex);
    try {
      // Step 1: Change milestone status to COMPLETED
      const statusPayload: ChangeMilestoneStatusPayload = {
        contractId: escrow.contractId,
        milestoneIndex: String(milestoneIndex),
        newStatus: "completed",
        serviceProvider: walletAddress,
      };

      await changeMilestoneStatus.mutateAsync({
        payload: statusPayload,
        type: "multi-release",
        address: walletAddress,
      });

      toast.success(`Prestamo ${milestoneIndex + 1} marcado como completado`);

      // Step 2: Release funds if escrow has balance
      const balance = Number(escrow.balance || 0);
      const milestoneAmount = Number(
        (escrow.milestones[milestoneIndex] as MultiReleaseMilestone)?.amount || 0,
      );

      if (balance >= milestoneAmount) {
        const releasePayload: MultiReleaseReleaseFundsPayload = {
          contractId: escrow.contractId,
          releaseSigner: walletAddress,
          milestoneIndex: String(milestoneIndex),
        };

        await releaseFunds.mutateAsync({
          payload: releasePayload,
          type: "multi-release",
          address: walletAddress,
        });

        toast.success(`Fondos del prestamo ${milestoneIndex + 1} liberados`);
      }

      await fetchEscrow();
    } catch (err) {
      toast.error(handleError(err as ErrorResponse).message);
    } finally {
      setReleasingIndex(null);
    }
  };

  if (!walletAddress) {
    return (
      <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          Conecta tu wallet para continuar
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground mt-4">
          Cargando escrow...
        </p>
      </main>
    );
  }

  if (error || !escrow) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg text-destructive">{error || "Escrow no encontrado"}</p>
        <Button
          onClick={() => router.push("/flow-testing")}
          variant="outline"
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </main>
    );
  }

  const milestones = (escrow.milestones || []) as MultiReleaseMilestone[];
  const escrowBalance = Number(escrow.balance || 0);

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => router.push("/flow-testing")}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Campanas</h1>
        </div>

        {/* Escrow Info */}
        <div className="mb-6 ml-14">
          <p className="text-sm text-muted-foreground">
            {escrow.title} &mdash;{" "}
            <code className="text-xs">{escrow.contractId}</code>
          </p>
        </div>

        {/* Manage Loans Card */}
        <div className="max-w-3xl mx-auto">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Gestionar Prestamos
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Balance: <span className="font-semibold">USDC {escrowBalance}</span>
            </p>

            {/* Milestones List */}
            <div className="flex flex-col gap-4 mb-6">
              {milestones.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay prestamos todavia
                </p>
              )}
              {milestones.map((milestone, index) => {
                const isReleased = milestone.flags?.released === true;
                const milestoneAmount = Number(milestone.amount || 0);
                const insufficientFunds = escrowBalance < milestoneAmount;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-lg px-4 py-3"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="font-medium truncate">
                        {milestone.description}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {milestone.receiver}
                      </span>
                    </div>
                    <span className="font-semibold mx-4 whitespace-nowrap">
                      USDC {milestone.amount}
                    </span>
                    <Button
                      onClick={() => handleComplete(index)}
                      disabled={
                        isReleased ||
                        releasingIndex !== null ||
                        insufficientFunds
                      }
                      variant={isReleased ? "secondary" : "outline"}
                      size="sm"
                      className="cursor-pointer whitespace-nowrap"
                      title={
                        insufficientFunds && !isReleased
                          ? "Fondos insuficientes en el escrow"
                          : undefined
                      }
                    >
                      {releasingIndex === index ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isReleased ? (
                        "Completado"
                      ) : (
                        "Completar"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add Loan Button */}
            <Button
              onClick={() => setAddLoanOpen(true)}
              className="cursor-pointer w-full"
            >
              Nuevo Prestamo
            </Button>
          </div>
        </div>

        <AddLoanDialog
          open={addLoanOpen}
          onOpenChange={setAddLoanOpen}
          escrow={escrow}
          onSuccess={fetchEscrow}
        />
      </div>
    </main>
  );
}

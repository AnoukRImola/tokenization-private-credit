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
  ApproveMilestonePayload,
} from "@trustless-work/escrow/types";
import {
  ErrorResponse,
  handleError,
} from "@tokenization/tw-blocks-shared/src/handle-errors/handle";
import { useEscrowContext } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import { useChangeMilestoneStatus } from "@tokenization/tw-blocks-shared/src/escrows/single-multi-release/change-milestone-status/dialog/useChangeMilestoneStatus";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EscrowHeader } from "./components/EscrowHeader";
import { EscrowLoansCard } from "./components/EscrowLoansCard";
import { AddLoanDialog } from "./AddLoanDialog";

interface EscrowDetailProps {
  contractId: string;
}

export function EscrowDetail({ contractId }: EscrowDetailProps) {
  const { walletAddress } = useWalletContext();
  const { releaseFunds, approveMilestone } = useEscrowsMutations();
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();
  const { selectedEscrow, setSelectedEscrow } = useEscrowContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releasingIndex, setReleasingIndex] = useState<number | null>(null);
  const [approvingIndex, setApprovingIndex] = useState<number | null>(null);
  const [addLoanOpen, setAddLoanOpen] = useState(false);

  const changeMilestoneStatusHook = useChangeMilestoneStatus();

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
      setSelectedEscrow(data[0]);
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

  const handleRelease = async (milestoneIndex: number) => {
    if (!walletAddress || !selectedEscrow?.contractId) return;

    setReleasingIndex(milestoneIndex);
    try {
      const payload: MultiReleaseReleaseFundsPayload = {
        contractId: selectedEscrow.contractId,
        releaseSigner: walletAddress,
        milestoneIndex: String(milestoneIndex),
      };

      await releaseFunds.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress,
      });

      toast.success(`Fondos del prestamo ${milestoneIndex + 1} liberados`);
      await fetchEscrow();
    } catch (err) {
      toast.error(handleError(err as ErrorResponse).message);
    } finally {
      setReleasingIndex(null);
    }
  };

  const handleApprove = async (milestoneIndex: number) => {
    if (!walletAddress || !selectedEscrow?.contractId) return;

    setApprovingIndex(milestoneIndex);
    try {
      const payload: ApproveMilestonePayload = {
        contractId: selectedEscrow.contractId,
        milestoneIndex: String(milestoneIndex),
        approver: walletAddress,
      };

      await approveMilestone.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress,
      });

      toast.success(`Prestamo ${milestoneIndex + 1} aprobado`);
      await fetchEscrow();
    } catch (err) {
      toast.error(handleError(err as ErrorResponse).message);
    } finally {
      setApprovingIndex(null);
    }
  };

  const handleChangeStatusClick = (milestoneIndex: number) => {
    changeMilestoneStatusHook.form.setValue(
      "milestoneIndex",
      String(milestoneIndex),
    );
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

  if (error || !selectedEscrow) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg text-destructive">
          {error || "Escrow no encontrado"}
        </p>
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

  const milestones = (selectedEscrow.milestones ||
    []) as MultiReleaseMilestone[];
  const escrowBalance = Number(selectedEscrow.balance || 0);

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        <EscrowHeader
          title={selectedEscrow.title}
          contractId={selectedEscrow.contractId || ""}
          onBack={() => router.push("/flow-testing")}
        />

        <EscrowLoansCard
          milestones={milestones}
          escrowBalance={escrowBalance}
          approvingIndex={approvingIndex}
          releasingIndex={releasingIndex}
          onApprove={handleApprove}
          onRelease={handleRelease}
          onChangeStatusClick={handleChangeStatusClick}
          onAddLoan={() => setAddLoanOpen(true)}
          changeStatusForm={changeMilestoneStatusHook.form}
          changeStatusSubmit={changeMilestoneStatusHook.handleSubmit}
          changeStatusSubmitting={changeMilestoneStatusHook.isSubmitting}
        />

        <AddLoanDialog
          open={addLoanOpen}
          onOpenChange={setAddLoanOpen}
          escrow={selectedEscrow as GetEscrowsFromIndexerResponse}
          onSuccess={fetchEscrow}
        />
      </div>
    </main>
  );
}

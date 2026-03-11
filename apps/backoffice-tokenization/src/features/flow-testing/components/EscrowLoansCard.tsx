import { Button } from "@tokenization/ui/button";
import { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import { MilestonesList } from "./MilestonesList";
import { UseFormReturn } from "react-hook-form";

interface EscrowLoansCardProps {
  milestones: MultiReleaseMilestone[];
  escrowBalance: number;
  approvingIndex: number | null;
  releasingIndex: number | null;
  onApprove: (index: number) => void;
  onRelease: (index: number) => void;
  onChangeStatusClick: (index: number) => void;
  onAddLoan: () => void;
  changeStatusForm: UseFormReturn<{
    milestoneIndex: string;
    status: string;
    evidence: string;
  }>;
  changeStatusSubmit: (e?: React.BaseSyntheticEvent) => void;
  changeStatusSubmitting: boolean;
}

export function EscrowLoansCard({
  milestones,
  escrowBalance,
  approvingIndex,
  releasingIndex,
  onApprove,
  onRelease,
  onChangeStatusClick,
  onAddLoan,
  changeStatusForm,
  changeStatusSubmit,
  changeStatusSubmitting,
}: EscrowLoansCardProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Gestionar Prestamos
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Balance: <span className="font-semibold">USDC {escrowBalance}</span>
        </p>

        <div className="mb-6">
          <MilestonesList
            milestones={milestones}
            escrowBalance={escrowBalance}
            approvingIndex={approvingIndex}
            releasingIndex={releasingIndex}
            onApprove={onApprove}
            onRelease={onRelease}
            onChangeStatusClick={onChangeStatusClick}
            changeStatusForm={changeStatusForm}
            changeStatusSubmit={changeStatusSubmit}
            changeStatusSubmitting={changeStatusSubmitting}
          />
        </div>

        <Button onClick={onAddLoan} className="cursor-pointer w-full">
          Nuevo Prestamo
        </Button>
      </div>
    </div>
  );
}

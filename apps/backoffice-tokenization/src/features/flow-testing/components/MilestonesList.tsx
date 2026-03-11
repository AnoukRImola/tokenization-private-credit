import { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import { MilestoneRow } from "./MilestoneRow";
import { UseFormReturn } from "react-hook-form";

interface MilestonesListProps {
  milestones: MultiReleaseMilestone[];
  escrowBalance: number;
  approvingIndex: number | null;
  releasingIndex: number | null;
  onApprove: (index: number) => void;
  onRelease: (index: number) => void;
  onChangeStatusClick: (index: number) => void;
  changeStatusForm: UseFormReturn<{
    milestoneIndex: string;
    status: string;
    evidence?: string;
  }>;
  changeStatusSubmit: (e?: React.BaseSyntheticEvent) => void;
  changeStatusSubmitting: boolean;
}

export function MilestonesList({
  milestones,
  escrowBalance,
  approvingIndex,
  releasingIndex,
  onApprove,
  onRelease,
  onChangeStatusClick,
  changeStatusForm,
  changeStatusSubmit,
  changeStatusSubmitting,
}: MilestonesListProps) {
  if (milestones.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No hay prestamos todavia
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {milestones.map((milestone, index) => {
        const isApproved = milestone.flags?.approved === true;
        const isReleased = milestone.flags?.released === true;
        const milestoneAmount = Number(milestone.amount || 0);
        const insufficientFunds = escrowBalance < milestoneAmount;

        return (
          <MilestoneRow
            key={index}
            index={index}
            description={milestone.description}
            receiver={milestone.receiver}
            amount={milestoneAmount}
            status={milestone.status}
            isApproved={isApproved}
            isReleased={isReleased}
            insufficientFunds={insufficientFunds}
            approvingIndex={approvingIndex}
            releasingIndex={releasingIndex}
            onApprove={onApprove}
            onRelease={onRelease}
            onChangeStatusClick={onChangeStatusClick}
            changeStatusForm={changeStatusForm}
            changeStatusSubmit={changeStatusSubmit}
            changeStatusSubmitting={changeStatusSubmitting}
          />
        );
      })}
    </div>
  );
}

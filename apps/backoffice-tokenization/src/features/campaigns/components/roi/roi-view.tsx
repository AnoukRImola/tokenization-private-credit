"use client";

import { RoiTable } from "@/features/campaigns/components/roi/roi-table";
import { FundRoiDialog } from "@/features/campaigns/components/roi/FundRoiDialog";
import { UpdateRoiDialog } from "@/features/campaigns/components/roi/UpdateRoiDialog";
import { useRoi } from "@/features/campaigns/hooks/use-roi";
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";

export function RoiView() {
  const { data: campaigns = [] } = useCampaigns();
  const {
    fundsDialogCampaign,
    fundDialogOpen,
    openFundsDialog,
    closeFundsDialog,
    roiDialogCampaign,
    roiDialogOpen,
    openRoiDialog,
    closeRoiDialog,
  } = useRoi();

  return (
    <div className="flex flex-col gap-8">
      {/* Campaigns table section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Campaña de ROI Activas
          </h3>
        </div>

        <RoiTable
          campaigns={campaigns}
          onAddFunds={openFundsDialog}
          onUpdateRoi={openRoiDialog}
        />
      </div>

      {/* Dialogs */}
      {fundsDialogCampaign?.vaultId ? (
        <FundRoiDialog
          open={fundDialogOpen}
          onOpenChange={(open) => { if (!open) closeFundsDialog(); }}
          campaignName={fundsDialogCampaign.name}
          vaultId={fundsDialogCampaign.vaultId}
          onFunded={closeFundsDialog}
        />
      ) : null}

      {roiDialogCampaign?.vaultId ? (
        <UpdateRoiDialog
          open={roiDialogOpen}
          onOpenChange={(open) => { if (!open) closeRoiDialog(); }}
          campaignName={roiDialogCampaign.name}
          vaultId={roiDialogCampaign.vaultId}
          onUpdated={closeRoiDialog}
        />
      ) : null}
    </div>
  );
}

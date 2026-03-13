import { useState } from "react";
import type { Campaign } from "@/features/campaigns/types/campaign.types";

export function useRoi() {
  const [fundsDialogCampaign, setFundsDialogCampaign] = useState<Campaign | null>(null);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);

  const [roiDialogCampaign, setRoiDialogCampaign] = useState<Campaign | null>(null);
  const [roiDialogOpen, setRoiDialogOpen] = useState(false);

  function openFundsDialog(campaign: Campaign) {
    setFundsDialogCampaign(campaign);
    setFundDialogOpen(true);
  }

  function closeFundsDialog() {
    setFundDialogOpen(false);
    setFundsDialogCampaign(null);
  }

  function openRoiDialog(campaign: Campaign) {
    setRoiDialogCampaign(campaign);
    setRoiDialogOpen(true);
  }

  function closeRoiDialog() {
    setRoiDialogOpen(false);
    setRoiDialogCampaign(null);
  }

  return {
    fundsDialogCampaign,
    fundDialogOpen,
    openFundsDialog,
    closeFundsDialog,
    roiDialogCampaign,
    roiDialogOpen,
    openRoiDialog,
    closeRoiDialog,
  };
}

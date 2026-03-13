import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Campaign } from "@/features/campaigns/types/campaign.types";
import type { RoiFormValues } from "@/features/campaigns/components/roi/types";

export function useRoi() {
  const [roiDialogCampaign, setRoiDialogCampaign] = useState<Campaign | null>(null);
  const [fundsDialogCampaign, setFundsDialogCampaign] = useState<Campaign | null>(null);

  const roiForm = useForm<RoiFormValues>({
    defaultValues: { roiPercentage: 0 },
  });

  function openRoiDialog(campaign: Campaign) {
    roiForm.reset();
    setRoiDialogCampaign(campaign);
  }

  function closeRoiDialog() {
    setRoiDialogCampaign(null);
  }

  function openFundsDialog(campaign: Campaign) {
    setFundsDialogCampaign(campaign);
  }

  function closeFundsDialog() {
    setFundsDialogCampaign(null);
  }

  const onSubmitRoi = roiForm.handleSubmit((data) => {
    console.log("Create ROI:", data, "for campaign:", roiDialogCampaign?.id);
    closeRoiDialog();
  });

  function onFundNow() {
    console.log("Fund now for campaign:", fundsDialogCampaign?.id);
    closeFundsDialog();
  }

  return {
    roiDialogCampaign,
    fundsDialogCampaign,
    roiForm,
    openRoiDialog,
    closeRoiDialog,
    openFundsDialog,
    closeFundsDialog,
    onSubmitRoi,
    onFundNow,
  };
}

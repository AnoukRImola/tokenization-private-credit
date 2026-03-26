"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@tokenization/ui/dialog";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Label } from "@tokenization/ui/label";
import { Loader2 } from "lucide-react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { useUpdateRoiPercentage } from "@/features/campaigns/hooks/useUpdateRoiPercentage";
import { getRoiPercentage } from "@/features/campaigns/services/campaigns.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getContractExplorerUrl } from "@tokenization/shared/lib/constants";

interface UpdateRoiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  vaultId: string;
  onUpdated: () => void;
}

export function UpdateRoiDialog({
  open,
  onOpenChange,
  campaignName,
  vaultId,
  onUpdated,
}: UpdateRoiDialogProps) {
  const t = useTranslations("roi");
  const [percentage, setPercentage] = useState("");
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const { walletAddress } = useWalletContext();

  useEffect(() => {
    if (!open || !walletAddress) return;
    setIsLoadingCurrent(true);
    getRoiPercentage(vaultId, walletAddress)
      .then(({ roiPercentage }) => setPercentage(roiPercentage))
      .catch(() => setPercentage(""))
      .finally(() => setIsLoadingCurrent(false));
  }, [open, vaultId, walletAddress]);

  const { execute, isSubmitting, error } = useUpdateRoiPercentage({
    onSuccess: () => {
      toast.success(t("updateRoiDialog.successToast"));
      onUpdated();
      onOpenChange(false);
      setPercentage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(percentage);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return;
    execute(vaultId, parsed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full! sm:max-w-lg!">
        <DialogHeader>
          <DialogTitle>
            {t("updateRoiDialog.title", {
              campaignName,
            })}
          </DialogTitle>
          <DialogDescription>{t("updateRoiDialog.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="roiPercentage">{t("updateRoiDialog.fieldLabel")}</Label>
            <Input
              id="roiPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder={t("updateRoiDialog.placeholder")}
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              disabled={isSubmitting || isLoadingCurrent}
              autoComplete="off"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || isLoadingCurrent || !percentage}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("updateRoiDialog.updatingLabel")}</span>
              </div>
            ) : (
              t("updateRoiDialog.submitLabel")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

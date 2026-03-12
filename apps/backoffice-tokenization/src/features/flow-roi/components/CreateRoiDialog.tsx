"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tokenization/ui/dialog";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Label } from "@tokenization/ui/label";
import { Loader2 } from "lucide-react";
import { useCreateRoi } from "../hooks/useCreateRoi";
import { toast } from "sonner";

interface CreateRoiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  tokenFactoryId: string;
  onCreated: (vaultId: string) => void;
}

export function CreateRoiDialog({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  tokenFactoryId,
  onCreated,
}: CreateRoiDialogProps) {
  const [roiPercentage, setRoiPercentage] = useState("");

  const { execute, isSubmitting, error } = useCreateRoi({
    campaignId,
    tokenFactoryId,
    onSuccess: (vaultId) => {
      toast.success("Vault deployed successfully");
      onCreated(vaultId);
      onOpenChange(false);
      setRoiPercentage("");
    },
  });

  const multiplier = Number.isFinite(Number(roiPercentage))
    ? 1 + Number(roiPercentage) / 100
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = Number(roiPercentage);
    if (!Number.isFinite(pct) || pct <= 0) return;
    execute(pct);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full! sm:max-w-lg!">
        <DialogHeader>
          <DialogTitle>Create ROI — {campaignName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="roiPercentage">ROI Percentage</Label>
            <Input
              id="roiPercentage"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 6 for 6%"
              value={roiPercentage}
              onChange={(e) => setRoiPercentage(e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Multiplier:{" "}
              <span className="font-medium">
                {Number.isFinite(multiplier) && multiplier > 0
                  ? multiplier.toFixed(4)
                  : "—"}
              </span>
            </p>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              Token Factory:{" "}
              <span className="font-mono">{tokenFactoryId}</span>
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || !roiPercentage}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deploying Vault...</span>
              </div>
            ) : (
              "Deploy Vault"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

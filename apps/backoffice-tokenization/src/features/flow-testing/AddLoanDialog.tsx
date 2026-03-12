"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tokenization/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { useEscrowsMutations } from "@tokenization/tw-blocks-shared/src/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@tokenization/tw-blocks-shared/src/handle-errors/handle";
import {
  GetEscrowsFromIndexerResponse,
  UpdateMultiReleaseEscrowPayload,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const addLoanSchema = z.object({
  description: z.string().min(1, "La descripcion es requerida"),
  amount: z.coerce.number().positive("Debe ser mayor a 0"),
});

type AddLoanFormValues = z.infer<typeof addLoanSchema>;

interface AddLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escrow: GetEscrowsFromIndexerResponse;
  onSuccess: () => void;
}

export function AddLoanDialog({
  open,
  onOpenChange,
  escrow,
  onSuccess,
}: AddLoanDialogProps) {
  const { walletAddress } = useWalletContext();
  const { updateEscrow } = useEscrowsMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddLoanFormValues>({
    resolver: zodResolver(addLoanSchema),
    defaultValues: {
      description: "",
      amount: "" as unknown as number,
    },
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!walletAddress || !escrow.contractId) return;

    setIsSubmitting(true);
    try {
      const existingMilestones = (
        (escrow.milestones || []) as MultiReleaseMilestone[]
      ).map((m, index) => ({
        description: m.description,
        amount: typeof m.amount === "string" ? Number(m.amount) : m.amount,
        receiver:
          (m as MultiReleaseMilestone & { receiver?: string }).receiver || "",
        evidence: escrow.milestones?.[index]?.evidence || "",
        status: escrow.milestones?.[index]?.status || "",
      }));

      const newMilestone = {
        description: data.description,
        amount: data.amount,
        receiver: walletAddress,
        evidence: "",
        status: "",
      };

      const payload: UpdateMultiReleaseEscrowPayload = {
        contractId: escrow.contractId,
        signer: walletAddress,
        escrow: {
          engagementId: escrow.engagementId,
          title: escrow.title,
          description: escrow.description,
          platformFee:
            typeof escrow.platformFee === "string"
              ? Number(escrow.platformFee)
              : escrow.platformFee,
          trustline: {
            address: escrow.trustline?.address || "",
            symbol: "USDC",
          },
          roles: {
            approver: escrow.roles?.approver || "",
            serviceProvider: escrow.roles?.serviceProvider || "",
            platformAddress: escrow.roles?.platformAddress || "",
            releaseSigner: escrow.roles?.releaseSigner || "",
            disputeResolver: escrow.roles?.disputeResolver || "",
          },
          milestones: [...existingMilestones, newMilestone],
        },
      };

      await updateEscrow.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress,
      });

      toast.success("Prestamo agregado exitosamente");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Prestamo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripcion<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Prestamo Q1 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Monto (USDC)<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Wallet</span>
              <code className="text-xs bg-muted px-3 py-2 rounded break-all">
                {walletAddress}
              </code>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agregando...
                </div>
              ) : (
                "Agregar Prestamo"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

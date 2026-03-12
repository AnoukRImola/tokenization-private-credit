"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@tokenization/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { Input } from "@tokenization/ui/input";
import { Button } from "@tokenization/ui/button";
import { Rocket, Info } from "lucide-react";
import {
  TokenService,
  type BuyTokenPayload,
} from "@/features/tokens/services/token.service";
import { SendTransactionService } from "@/lib/sendTransactionService";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { useSelectedEscrow } from "@/features/tokens/context/SelectedEscrowContext";
import { InvestmentService } from "@/features/investments/services/investment.service";
import { Card } from "@tokenization/ui/card";
import { cn } from "@/lib/utils";
import { MultiReleaseMilestone } from "@trustless-work/escrow";
import { BalanceProgressBar } from "@tokenization/tw-blocks-shared/src/escrows/indicators/balance-progress/bar/BalanceProgress";
import { formatAddress } from "@tokenization/tw-blocks-shared/src/helpers/format.helper";
import { CircleCheckBig } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button as ShadButton } from "@tokenization/ui/button";
import Link from "next/link";

type InvestFormValues = {
  amount: number;
};

interface InvestDialogProps {
  tokenSaleContractId: string;
  triggerLabel?: string;
}

const DEFAULT_USDC_ADDRESS = process.env.NEXT_PUBLIC_DEFAULT_USDC_ADDRESS ?? "";

export function InvestDialog({
  tokenSaleContractId,
  triggerLabel = "Invest",
}: InvestDialogProps) {
  const { walletAddress } = useWalletContext();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [txHash, setTxHash] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const selected = useSelectedEscrow();
  const queryClient = useQueryClient();

  const form = useForm<InvestFormValues>({
    defaultValues: { amount: 0 },
    mode: "onChange",
  });

  const onSubmit = async (values: InvestFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet to continue.");
      return;
    }
    if (!tokenSaleContractId) {
      setErrorMessage("Missing token sale contract id.");
      return;
    }
    if (!values.amount || values.amount <= 0) {
      setErrorMessage("Enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      const tokenService = new TokenService();

      const payload: BuyTokenPayload = {
        tokenSaleContractId,
        usdcAddress: DEFAULT_USDC_ADDRESS,
        payerAddress: walletAddress,
        beneficiaryAddress: walletAddress,
        amount: values.amount,
      };

      const buyResponse = await tokenService.buyToken(payload);

      if (!buyResponse?.success || !buyResponse?.xdr) {
        throw new Error(
          buyResponse?.message ?? "Failed to build buy transaction."
        );
      }

      const signedTxXdr = await signTransaction({
        unsignedTransaction: buyResponse.xdr,
        address: walletAddress,
      });

      const sender = new SendTransactionService();
      const submitResponse = await sender.sendTransaction({
        signedXdr: signedTxXdr,
      });

      if (submitResponse.status !== "SUCCESS") {
        throw new Error(
          submitResponse.message ?? "Transaction submission failed."
        );
      }

      setTxHash(submitResponse.hash ?? null);
      // Refresh the escrow balance using TanStack Query
      const balanceQueryKey = ["escrows", [selected.escrowId]] as const;
      const singleEscrowKey = ["escrow", selected.escrowId] as const;

      // Balance used by BalanceProgressBar
      await queryClient.invalidateQueries({ queryKey: balanceQueryKey });
      await queryClient.refetchQueries({ queryKey: balanceQueryKey });

      // Escrow details (per-card) used by the Carousel modal content
      await queryClient.invalidateQueries({ queryKey: singleEscrowKey });
      await queryClient.refetchQueries({ queryKey: singleEscrowKey });

      // Escrows list (bulk fetch) used by the Carousel (partial match)
      await queryClient.invalidateQueries({ queryKey: ["escrows-by-ids"] });
      await queryClient.refetchQueries({ queryKey: ["escrows-by-ids"] });

      setSuccessMessage("Your investment transaction was sent successfully.");
      form.reset({ amount: 0 });
    } catch (err) {
      let message =
        err instanceof Error
          ? err.message
          : "Unexpected error while processing your investment.";

      // Check if error is due to insufficient USDC balance
      if (
        message.includes("resulting balance is not within the allowed range") ||
        message.includes("balance is not within") ||
        message.includes("insufficient balance")
      ) {
        message = "Insufficient USDC balance. Please ensure your wallet has enough USDC to complete this transaction. You can get testnet USDC from a Stellar testnet faucet.";
      }

      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = React.useMemo(() => {
    if (!selected.escrow || selected.escrow.type !== "multi-release") return 0;

    const milestones = selected.escrow.milestones as MultiReleaseMilestone[];

    return milestones.reduce((acc, milestone) => acc + milestone.amount, 0);
  }, [selected.escrow?.milestones]);

  const currency = selected.escrow?.trustline?.symbol ?? "USDC";

  const YIELD_RATE = 0.085;
  const TERM_MONTHS = 12;
  const watchedAmount = form.watch("amount");
  const safeAmount =
    typeof watchedAmount === "number" && !Number.isNaN(watchedAmount) && watchedAmount > 0
      ? watchedAmount
      : 0;
  const estimatedReturn = safeAmount * YIELD_RATE;
  const totalAtMaturity = safeAmount + estimatedReturn;

  const isSubmitDisabled =
    submitting ||
    !form.watch("amount") ||
    Number.isNaN(form.watch("amount")) ||
    form.watch("amount") <= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer gap-1.5">
          <Rocket className="size-3.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${successMessage ? "sm:max-w-4xl" : "sm:max-w-lg"} max-h-[80vh] overflow-y-auto`}
      >
        {successMessage ? (
          <div className="w-full overflow-hidden p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
              {/* Left Column: Image */}
              <div className="flex items-center justify-center">
                {selected.imageSrc ? (
                  <img
                    className="max-h-80 w-auto transition duration-300 object-cover"
                    src={selected.imageSrc as string}
                    loading="lazy"
                    decoding="async"
                    alt={
                      selected.escrow?.title || "Background of a beautiful view"
                    }
                  />
                ) : (
                  <div className="w-full h-48 md:h-64 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <span className="text-muted-foreground text-sm">
                      No image
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Information */}
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground">
                  <CircleCheckBig className="w-6 h-6 md:w-10 md:h-10 text-green-600 shrink-0" />{" "}
                  Investment Successful!
                </h2>
                <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                  Your investment transaction was sent successfully.
                </p>

                <div className="pt-2">
                  <Link
                    href={`https://stellar.expert/explorer/testnet${txHash ? `/tx/${txHash}` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShadButton variant="outline" size="sm">
                      View Transaction
                    </ShadButton>
                  </Link>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2">
                    {selected.escrow?.title || "No title"}
                  </h3>
                </div>

                {/* Description - Truncated */}
                {selected.escrow?.description && (
                  <div>
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                      {selected.escrow?.description}
                    </p>
                  </div>
                )}

                {/* Amount and Balance */}
                <BalanceProgressBar
                  contractId={selected.escrowId ?? ""}
                  target={totalAmount ?? 0}
                  currency={selected.escrow?.trustline?.symbol ?? "USDC"}
                />

                {/* Metadata */}
                <div className="text-xs md:text-sm text-muted-foreground pt-2 border-t border-border">
                  <p>
                    <span className="font-bold">ID:</span>{" "}
                    {formatAddress(selected.escrowId)}
                  </p>

                  {selected.tokenSaleContractId && (
                    <p>
                      <span className="font-bold">Contract Sale:</span>{" "}
                      {formatAddress(selected.tokenSaleContractId)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-semibold">
                      Amount (USDC)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="h-14 text-xl pr-20 rounded-xl border-muted bg-muted/30"
                          {...field}
                          value={
                            Number.isNaN(field.value as number) ||
                              field.value === ("" as unknown as number)
                              ? ""
                              : String(field.value)
                          }
                          onChange={(e) => {
                            const next =
                              e.target.value === ""
                                ? ("" as unknown as number)
                                : Number(e.target.value);
                            field.onChange(next);
                          }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-500">
                          USDC
                        </span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Available balance:{" "}
                      <span className="font-medium">
                        {totalAmount > 0
                          ? `${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${currency}`
                          : `0.00 ${currency}`}
                      </span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-muted/30 px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Estimated Yield
                  </span>
                  <p className="mt-1 text-lg font-bold text-teal-600">
                    8.5% APY
                  </p>
                </div>
                <div className="rounded-xl border bg-muted/30 px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Term Length
                  </span>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    12 Months
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-teal-200 bg-linear-to-br from-teal-50 to-cyan-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Your investment</span>
                  <span className="text-sm font-semibold text-foreground">
                    {safeAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated return ({(YIELD_RATE * 100).toFixed(1)}% &times; {TERM_MONTHS}mo)
                  </span>
                  <span className="text-sm font-semibold text-teal-600">
                    +{estimatedReturn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="border-t border-teal-200 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total at maturity</span>
                  <span className="text-lg font-bold text-teal-700">
                    {totalAtMaturity.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Disclaimer:</span> Please
                  review your investment amount carefully. Once confirmed, these
                  amounts are not editable and the transaction is final.
                </p>
              </div>

              {errorMessage ? (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-12 w-full rounded-xl bg-cyan-500 text-base font-semibold text-white hover:bg-cyan-600"
              >
                {submitting ? "Processing..." : "Confirm Investment"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By clicking confirm, you agree to the Terms of Service and
                Investment Agreement.
              </p>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

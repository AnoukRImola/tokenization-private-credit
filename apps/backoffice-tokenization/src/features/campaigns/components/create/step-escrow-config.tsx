"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@tokenization/ui/form";
import { Input } from "@tokenization/ui/input";
import type { CreateCampaignFormValues } from "@/features/campaigns/types/campaign.types";
import { numericInputKeyDown, parseNumericInput } from "@/lib/numeric-input";
import { formatCurrency } from "@/lib/utils";

interface Props {
  form: UseFormReturn<CreateCampaignFormValues>;
  totalCommitment: number;
}

export function StepEscrowConfig({ form, totalCommitment }: Props) {
  const targetAmount = form.watch("targetAmount");
  const durationDays = form.watch("durationDays");

  return (
    <Form {...form}>
      <div className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="targetAmount"
          rules={{
            required: "El monto objetivo es obligatorio",
            min: { value: 1, message: "El monto debe ser mayor a 0" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Objetivo (USDC)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="ej. 50000"
                  {...field}
                  onKeyDown={numericInputKeyDown}
                  onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {targetAmount > 0 && (
          <div className="rounded-xl border border-border bg-secondary/40 p-4 flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">Resumen de la Campaña</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Monto Objetivo</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(targetAmount, 2)} USDC
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Duración del Escrow</span>
                <span className="text-sm font-semibold text-foreground">{durationDays} Días</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Tipo de Transacción</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-secondary">1. USDC Trustline</span>
                  <span className="text-xs text-text-secondary">2. Autorización Escrow</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide font-medium">
                  Compromiso Total
                </p>
              </div>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(totalCommitment, 2)} USDC
              </span>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
}

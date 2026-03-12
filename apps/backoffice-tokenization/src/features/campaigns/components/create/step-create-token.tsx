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
import { numericInputKeyDown, parseNumericInput } from "@/lib/numeric-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tokenization/ui/select";
import type { CreateCampaignFormValues } from "@/features/campaigns/types/campaign.types";

interface Props {
  form: UseFormReturn<CreateCampaignFormValues>;
}

export function StepCreateToken({ form }: Props) {
  const tokenAsset = form.watch("tokenAsset");

  return (
    <Form {...form}>
      <div className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="tokenName"
          rules={{ required: "El nombre del token es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Token</FormLabel>
              <FormControl>
                <Input placeholder="ej. AgriGrowth Bond" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tokenAsset"
            rules={{ required: "El activo es obligatorio" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activo del Token</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar activo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="XLM">XLM</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investmentAmount"
            rules={{
              required: "El monto es obligatorio",
              min: { value: 0.01, message: "Debe ser mayor a 0" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto de Inversión</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="pr-14"
                      {...field}
                      onKeyDown={numericInputKeyDown}
                      onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                      {tokenAsset}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 px-4 py-3">
          <span className="mt-0.5 text-primary shrink-0">ℹ</span>
          <p className="text-xs text-text-secondary leading-relaxed">
            Este monto quedará bloqueado en el contrato inteligente de escrow hasta que la campaña alcance su objetivo de financiamiento.
          </p>
        </div>
      </div>
    </Form>
  );
}

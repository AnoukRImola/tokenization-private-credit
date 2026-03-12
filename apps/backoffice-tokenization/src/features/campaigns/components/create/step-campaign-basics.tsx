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
import { Textarea } from "@tokenization/ui/textarea";
import type { CreateCampaignFormValues } from "@/features/campaigns/types/campaign.types";
import { numericInputKeyDown, parseNumericInput } from "@/lib/numeric-input";

interface Props {
  form: UseFormReturn<CreateCampaignFormValues>;
}

export function StepCampaignBasics({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Campaña</FormLabel>
              <FormControl>
                <Input
                  placeholder="ej. Micro-Préstamos para Mujeres Emprendedoras"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "La descripción es obligatoria" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe brevemente el propósito de este fondo..."
                  className="resize-none min-h-28"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="durationDays"
            rules={{
              required: "La duración es obligatoria",
              min: { value: 1, message: "Mínimo 1 día" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (Días)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="ej. 90"
                    {...field}
                    onKeyDown={numericInputKeyDown}
                    onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedRoi"
            rules={{
              required: "El ROI esperado es obligatorio",
              min: { value: 0, message: "Debe ser mayor o igual a 0" },
              max: { value: 100, message: "No puede ser mayor a 100%" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retorno Esperado</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="ej. 12"
                      className="pr-7"
                      {...field}
                      onKeyDown={numericInputKeyDown}
                      onChange={(e) => field.onChange(parseNumericInput(e.target.value, 100))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Loader2, PenLine } from "lucide-react";
import { cn } from "@tokenization/shared/lib/utils";
import { Button } from "@tokenization/ui/button";
import { useCreateCampaign } from "@/features/campaigns/hooks/use-create-campaign";
import { StepCampaignBasics } from "./step-campaign-basics";
import { StepEscrowConfig } from "./step-escrow-config";
import { StepCreateToken } from "./step-create-token";

const STEPS = [
  { number: 1, label: "Campaña Básica" },
  { number: 2, label: "Configuración Escrow" },
  { number: 3, label: "Crear Token" },
];

export function CreateCampaignStepper() {
  const router = useRouter();
  const { form, step, totalSteps, nextStep, prevStep, isSubmitting, error, onSubmit, totalCommitment } =
    useCreateCampaign();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map(({ number, label }, index) => (
          <div key={number} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                step === number
                  ? "bg-primary text-primary-foreground"
                  : step > number
                  ? "bg-accent text-foreground"
                  : "text-text-muted"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs",
                  step === number
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : step > number
                    ? "bg-foreground/10"
                    : "bg-border"
                )}
              >
                {number}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 transition-colors",
                  step > number ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6">
        {step === 1 && <StepCampaignBasics form={form} />}
        {step === 2 && (
          <StepEscrowConfig form={form} totalCommitment={totalCommitment} />
        )}
        {step === 3 && <StepCreateToken form={form} />}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={step === 1 ? () => router.push("/campaigns") : prevStep}
        >
          {step === 1 ? "Cancelar" : "← Atrás"}
        </Button>

        {step < totalSteps ? (
          <Button type="button" onClick={nextStep}>
            Siguiente →
          </Button>
        ) : (
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <PenLine className="size-4" />
                Confirmar y Firmar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

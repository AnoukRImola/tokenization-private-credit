"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@tokenization/shared/lib/utils";
import { Button } from "@tokenization/ui/button";
import { useCreateCampaign } from "@/features/campaigns/hooks/use-create-campaign";
import { StepCampaignBasics } from "./step-campaign-basics";
import { StepEscrowConfig } from "./step-escrow-config";
import { StepCreateToken } from "./step-create-token";

export function CreateCampaignStepper() {
  const t = useTranslations("createCampaign");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const {
    form,
    step,
    nextStep,
    prevStep,
    walletAddress,
    // Escrow
    escrowStatus,
    escrowContractId,
    escrowError,
    initializeEscrow,
    retryEscrow,
    // Deploy
    deployPhases,
    deployPhaseLabels,
    deployFailedAt,
    runDeployAndCreate,
    retryDeploy,
  } = useCreateCampaign();

  const STEPS = [
    { number: 1, label: t("step1") },
    { number: 2, label: t("step2") },
    { number: 3, label: t("step3") },
  ];

  if (!walletAddress) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-lg text-muted-foreground">
            {tCommon("connectWallet")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 justify-center">
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
          <StepEscrowConfig
            escrowStatus={escrowStatus}
            escrowContractId={escrowContractId}
            escrowError={escrowError}
            onInitialize={initializeEscrow}
            onRetry={retryEscrow}
            onNext={nextStep}
          />
        )}
        {step === 3 && (
          <StepCreateToken
            phases={deployPhases}
            phaseLabels={deployPhaseLabels}
            failedAt={deployFailedAt}
            onRun={runDeployAndCreate}
            onRetry={retryDeploy}
          />
        )}
      </div>

      {/* Navigation - only show for Step 1 */}
      {step === 1 && (
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/campaigns")}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="button" onClick={nextStep}>
            {tCommon("next")}
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { StepCampaignForm } from "./steps/StepCampaignForm";
import { StepInitializeEscrow } from "./steps/StepInitializeEscrow";
import { StepTokenizeEscrow } from "./steps/StepTokenizeEscrow";
import { FlowStepper } from "./components/FlowStepper";
import { FLOW_STEPS } from "./constants";

export function CreateCampaignFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return (
      <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          Conecta tu wallet para continuar
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        <FlowStepper
          steps={FLOW_STEPS}
          currentStep={currentStep}
        />

        {currentStep === 0 && (
          <StepCampaignForm onNext={() => setCurrentStep(1)} />
        )}
        {currentStep === 1 && (
          <StepInitializeEscrow
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && <StepTokenizeEscrow />}
      </div>
    </main>
  );
}

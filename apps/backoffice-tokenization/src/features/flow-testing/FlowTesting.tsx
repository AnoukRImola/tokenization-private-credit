"use client";

import { useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { StepCampaignForm } from "./steps/StepCampaignForm";
import { StepInitializeEscrow } from "./steps/StepInitializeEscrow";
import { Check } from "lucide-react";

const steps = [
  { label: "Nueva campaña" },
  { label: "Inicializar Escrow" },
  { label: "Proximamente" },
];

export function FlowTesting() {
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
        {/* Stepper */}
        <nav className="flex items-center justify-center mb-12">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isDisabled = index > 1;

            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm whitespace-nowrap ${
                      isActive
                        ? "font-bold text-foreground"
                        : isCompleted
                          ? "font-medium text-foreground"
                          : isDisabled
                            ? "text-muted-foreground/30"
                            : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 mt-[-1.5rem] ${
                      index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Step Content */}
        {currentStep === 0 && (
          <StepCampaignForm onNext={() => setCurrentStep(1)} />
        )}
        {currentStep === 1 && <StepInitializeEscrow />}
      </div>
    </main>
  );
}

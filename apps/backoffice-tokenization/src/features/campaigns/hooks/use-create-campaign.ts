"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { CreateCampaignFormValues } from "@/features/campaigns/types/campaign.types";
import { createCampaign } from "@/features/campaigns/services/campaigns.api";

const TOTAL_STEPS = 3;

const STEP_FIELDS: Record<number, (keyof CreateCampaignFormValues)[]> = {
  1: ["name", "description", "durationDays", "expectedRoi"],
  2: ["targetAmount"],
  3: ["tokenName", "tokenAsset", "investmentAmount"],
};

export function useCreateCampaign() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<CreateCampaignFormValues>({
    defaultValues: {
      name: "",
      description: "",
      durationDays: 90,
      expectedRoi: 0,
      targetAmount: 0,
      tokenName: "",
      tokenAsset: "USDC",
      investmentAmount: 0,
    },
    mode: "onChange",
  });

  const targetAmount = form.watch("targetAmount");
  const totalCommitment = targetAmount;

  const nextStep = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createCampaign(values);
      router.push("/campaigns");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    step,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    isSubmitting,
    error,
    onSubmit,
    totalCommitment,
  };
}

"use client";

import { useTranslations } from "next-intl";
import type { CampaignStatus } from "../types/campaign.types";

interface CampaignFilterProps {
  value: CampaignStatus | "all";
  onChange: (value: CampaignStatus | "all") => void;
}

export function CampaignFilter({ value, onChange }: CampaignFilterProps) {
  const t = useTranslations("campaigns");

  const STATUS_OPTIONS: { value: CampaignStatus | "all"; labelKey: string }[] = [
    { value: "all", labelKey: "filterAll" },
    { value: "FUNDRAISING", labelKey: "filterFundraising" },
    { value: "ACTIVE", labelKey: "filterActive" },
    { value: "REPAYMENT", labelKey: "filterRepayment" },
    { value: "CLAIMABLE", labelKey: "filterClaimable" },
    { value: "CLOSED", labelKey: "filterClosed" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-8 rounded-lg px-3 text-xs font-medium transition-colors ${
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          }`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}

"use client";

import type { SharedCampaignStatus } from "@tokenization/shared/src/types/campaign";

const STATUS_OPTIONS: { value: SharedCampaignStatus | "all"; labelKey: string }[] = [
  { value: "all", labelKey: "filterAll" },
  { value: "FUNDRAISING", labelKey: "filterFundraising" },
  { value: "ACTIVE", labelKey: "filterActive" },
  { value: "REPAYMENT", labelKey: "filterRepayment" },
  { value: "CLAIMABLE", labelKey: "filterClaimable" },
  { value: "CLOSED", labelKey: "filterClosed" },
];

export interface CampaignToolbarLabels {
  searchPlaceholder: string;
  filterAll: string;
  filterFundraising: string;
  filterActive: string;
  filterRepayment: string;
  filterClaimable: string;
  filterClosed: string;
}

export interface CampaignToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue: SharedCampaignStatus | "all";
  onFilterChange: (value: SharedCampaignStatus | "all") => void;
  labels: CampaignToolbarLabels;
}

export function CampaignToolbar({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  labels,
}: CampaignToolbarProps) {
  const labelByKey: Record<string, string> = {
    filterAll: labels.filterAll,
    filterFundraising: labels.filterFundraising,
    filterActive: labels.filterActive,
    filterRepayment: labels.filterRepayment,
    filterClaimable: labels.filterClaimable,
    filterClosed: labels.filterClosed,
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={`h-8 rounded-lg px-3 text-xs font-medium transition-colors ${
              filterValue === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {labelByKey[option.labelKey] ?? option.value}
          </button>
        ))}
      </div>
      <div className="w-full sm:max-w-xs">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder={labels.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}

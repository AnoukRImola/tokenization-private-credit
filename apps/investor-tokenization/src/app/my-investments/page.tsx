"use client";

import { useState, useMemo } from "react";
import { SectionTitle } from "@/components/shared/section-title";
import { CampaignToolbar } from "@/features/roi/components/campaign-toolbar";
import { CampaignList } from "@/features/roi/components/campaign-list";
import { mockCampaigns } from "@/features/roi/data/mock-campaigns";
import type { CampaignStatus } from "@/features/roi/types/campaign.types";

export default function MyInvestmentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((c) => {
      const matchesStatus = filter === "all" || c.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [search, filter]);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title="My Investments"
        description="Track your active investments and claim your returns."
      />
      <CampaignToolbar
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
      <CampaignList campaigns={filteredCampaigns} />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { StatItem } from "@/components/shared/stat-item";
import { CampaignToolbar } from "./campaign-toolbar";
import { CampaignList } from "./campaign-list";
import { MOCK_CAMPAIGNS } from "@/features/campaigns/mock/campaigns.mock";
import type { Campaign, CampaignStatus } from "@/features/campaigns/types/campaign.types";

export function CampaignsView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");

  const filtered = useMemo<Campaign[]>(() => {
    return MOCK_CAMPAIGNS.filter((c) => {
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
      {/* Toolbar */}
      <CampaignToolbar
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      {/* List */}
      <CampaignList campaigns={filtered} />
    </div>
  );
}

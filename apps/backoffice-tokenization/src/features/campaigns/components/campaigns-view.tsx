"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CampaignToolbar } from "./campaign-toolbar";
import { CampaignList } from "./campaign-list";
import { useCampaigns } from "@/features/campaigns/hooks/use-campaigns";
import type { CampaignStatus } from "@/features/campaigns/types/campaign.types";

export function CampaignsView() {
  const t = useTranslations("campaigns");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const { data: campaigns = [], isLoading, isError } = useCampaigns();

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesStatus = filter === "all" || c.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [campaigns, search, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-text-muted text-sm">
        {t("loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive text-sm">
        {t("loadError")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <CampaignToolbar
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
      <CampaignList campaigns={filtered} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { SectionTitle } from "@tokenization/ui/section-title";
import type { SharedCampaign, SharedCampaignStatus } from "@tokenization/shared/src/types/campaign";
import { CampaignToolbar } from "./campaign-toolbar";
import type { CampaignToolbarLabels } from "./campaign-toolbar";

export interface SharedCampaignsViewProps {
  title: string;
  description: string;
  campaigns: SharedCampaign[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  headerActions?: React.ReactNode;
  toolbarLabels: CampaignToolbarLabels;
  children: (filteredCampaigns: SharedCampaign[]) => React.ReactNode;
}

export function SharedCampaignsView({
  title,
  description,
  campaigns,
  isLoading = false,
  loadingMessage,
  emptyMessage,
  headerActions,
  toolbarLabels,
  children,
}: SharedCampaignsViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SharedCampaignStatus | "all">("all");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesStatus = filter === "all" || c.status === filter;
      const matchesSearch =
        search.trim() === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [campaigns, search, filter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-1">
        <SectionTitle title={title} description={description} />
        {headerActions != null ? <div className="flex gap-2">{headerActions}</div> : null}
      </div>
      <CampaignToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={filter}
        onFilterChange={setFilter}
        labels={toolbarLabels}
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {loadingMessage ?? ""}
        </p>
      ) : filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">{emptyMessage ?? ""}</p>
        </div>
      ) : (
        children(filteredCampaigns)
      )}
    </div>
  );
}

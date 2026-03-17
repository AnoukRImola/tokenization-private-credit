"use client";

import { useState } from "react";
import { SectionTitle } from "@tokenization/ui/section-title";
import { CampaignToolbar } from "@/features/roi/components/campaign-toolbar";
import { ProjectList } from "@/features/transparency/ProjectList";
import type { CampaignStatus } from "@/features/roi/types/campaign.types";
import { useTranslations } from "next-intl";

export default function CampaignsPage() {
  const t = useTranslations("campaigns");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t("title")}
        description={t("description")}
      />
      <CampaignToolbar
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />
      <ProjectList search={search} filter={filter} />
    </div>
  );
}

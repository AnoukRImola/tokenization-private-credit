"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { RoiHeader } from "@/features/roi/components/roi-header";
import { ProjectList } from "@/features/transparency/ProjectList";

const CampaignToolbar = dynamic(
  () =>
    import("@/features/roi/components/campaign-toolbar").then(
      (m) => m.CampaignToolbar
    ),
  { ssr: false }
);

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <RoiHeader searchValue={search} onSearchChange={setSearch} />
      <CampaignToolbar filterValue={filter} onFilterChange={setFilter} />
      <ProjectList search={search} filter={filter} />
    </div>
  );
}

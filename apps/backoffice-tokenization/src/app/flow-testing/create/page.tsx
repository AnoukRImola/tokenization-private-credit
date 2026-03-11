"use client";

import { Suspense } from "react";
import { CreateCampaignFlow } from "@/features/flow-testing/CreateCampaignFlow";

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={null}>
      <CreateCampaignFlow />
    </Suspense>
  );
}

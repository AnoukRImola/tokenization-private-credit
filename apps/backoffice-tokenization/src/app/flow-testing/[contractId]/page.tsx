"use client";

import { use, Suspense } from "react";
import { EscrowDetail } from "@/features/flow-testing/EscrowDetail";

export default function EscrowDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = use(params);

  return (
    <Suspense fallback={null}>
      <EscrowDetail contractId={contractId} />
    </Suspense>
  );
}

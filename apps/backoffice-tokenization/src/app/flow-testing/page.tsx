"use client";

import { Suspense } from "react";
import { FlowTesting } from "@/features/flow-testing/FlowTesting";

export default function FlowTestingPage() {
  return (
    <Suspense fallback={null}>
      <FlowTesting />
    </Suspense>
  );
}

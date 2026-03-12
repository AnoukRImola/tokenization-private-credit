"use client";

import { Suspense } from "react";
import { RoiDashboard } from "@/features/roi/RoiDashboard";

export default function RoiPage() {
  return (
    <Suspense fallback={null}>
      <RoiDashboard />
    </Suspense>
  );
}

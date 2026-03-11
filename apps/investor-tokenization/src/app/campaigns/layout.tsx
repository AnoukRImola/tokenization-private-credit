import { RoiDashboardShell } from "@/features/roi/roi-dashboard-shell";
import { ReactNode } from "react";

export default function CampaignsLayout({ children }: { children: ReactNode }) {
  return <RoiDashboardShell>{children}</RoiDashboardShell>;
}

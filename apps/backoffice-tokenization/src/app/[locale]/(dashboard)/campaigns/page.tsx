"use client";

import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { CampaignsView } from "@/features/campaigns/components/campaigns-view";
import { Button } from "@tokenization/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CampaignsPage() {
  const t = useTranslations("campaigns");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-1">
        <SectionTitle
          title={t("title")}
          description={t("description")}
        />
        <div className="flex gap-2">

          <Button size="lg" asChild>
            <Link href="/campaigns/new">
              <Plus size={16} />
              {t("newCampaign")}
            </Link>
          </Button>
        </div>
      </div>
      <CampaignsView />
    </div>
  );
}

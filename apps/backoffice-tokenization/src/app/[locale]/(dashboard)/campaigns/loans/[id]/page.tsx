 "use client";

import { SectionTitle } from "@tokenization/ui/section-title";
import { ManageLoansView } from "@/features/campaigns/components/loans/manage-loans-view";
import { useTranslations } from "next-intl";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CampaignLoansPage({ params }: Props) {
  const { id } = use(params);
  const t = useTranslations("loans");

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t("title")}
        description={t("description")}
      />
      <ManageLoansView contractId={id} />
    </div>
  );
}

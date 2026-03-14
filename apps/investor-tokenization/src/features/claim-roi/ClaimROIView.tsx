"use client";

import { VaultList } from "./VaultList";
import { useTranslations } from "next-intl";

export const ClaimROIView = () => {
  const t = useTranslations("claimRoi");

  return (
    <div className="flex flex-col gap-5 mt-10 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <VaultList />
    </div>
  );
};

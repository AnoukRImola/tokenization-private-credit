import { SectionTitle } from "@/components/shared/section-title";
import { ManageLoansView } from "@/features/campaigns/components/loans/manage-loans-view";

export default function ManageLoansPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title="Gestionar Préstamos"
        description="Administra los hitos y préstamos activos de la campaña."
      />
      <ManageLoansView />
    </div>
  );
}

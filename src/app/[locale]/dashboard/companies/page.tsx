import AddCompanyDialog from "@/features/dashboard/components/companies/add-company-dialog";
import CompaniesTable from "@/features/dashboard/components/companies/companies-table";
import { getCompanies } from "@/features/dashboard/dashboadrd.queires";
import { getTranslations } from "next-intl/server";

export default async function Companies() {
  const t = await getTranslations("dashboard.companies");
  const companies = await getCompanies();

  return (
    <div className="p-6">
      <section className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <AddCompanyDialog />
      </section>

      <CompaniesTable companies={companies} />
    </div>
  );
}

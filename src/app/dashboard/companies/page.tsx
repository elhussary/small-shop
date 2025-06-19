import AddCompanyDialog from "@/features/dashboard/components/companies/add-company-dialog";
import CompaniesTable from "@/features/dashboard/components/companies/companies-table";
import { getCompanies } from "@/features/dashboard/dashboadrd.queires";

export default async function Companies() {
  const companies = await getCompanies();
  
  return (
    <div className="p-6">
      <section className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
        <AddCompanyDialog />
      </section>

      <CompaniesTable companies={companies} />
    </div>
  );
}

import CompanyProducts from "@/components/company-products"; // your UI component
import { getCompanyWithProducts } from "@/db/queires";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
  searchParams?: { search?: string };
}
export default async function CompanyProductsPage({ params, searchParams }: Props) {
  const data = await getCompanyWithProducts(params.slug, searchParams?.search);

  if (!data) {
    notFound();
  }

  return <CompanyProducts company={data.company} products={data.products} />;
}

import CompanyProducts from "@/components/company-products"; // your UI component
import { getCompanyWithProducts } from "@/db/queires";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string>>;
}

export default async function CompanyProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const search = await searchParams?.then((params) => params.search);

  const data = await getCompanyWithProducts(slug, search);

  if (!data) {
    notFound();
  }

  return <CompanyProducts company={data.company} products={data.products} />;
}

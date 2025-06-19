import CompanyProducts from "@/components/company-products"; // your UI component
import { getCompanyWithProducts } from "@/db/queires";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<Record<string, string>>;
}

export default async function CompanyProductsPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getCompanyWithProducts(slug);

  if (!data) {
    notFound();
  }

  return <CompanyProducts company={data.company} products={data.products} />;
}

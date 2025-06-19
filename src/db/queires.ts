"use server";

import { companies, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "./drizzle";

export async function getCompanyWithProducts(slug: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
  });

  if (!company) return null;

  const companyProducts = await db.query.products.findMany({
    where: eq(products.companyId, company.id),
    with: {
      images: true,
      company: true,
    },
  });

  return { company, products: companyProducts };
}

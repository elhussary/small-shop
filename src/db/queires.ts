import "server-only";

import { companies, products } from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "./drizzle";

export async function getCompanyWithProducts(slug: string, search?: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
  });

  if (!company) return null;

  const baseCondition = eq(products.companyId, company.id);

  const productCondition = search
    ? and(
        baseCondition,
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      )
    : baseCondition;

  const companyProducts = await db.query.products.findMany({
    where: productCondition,
    with: {
      images: true,
      company: true,
    },
  });

  return { company, products: companyProducts };
}

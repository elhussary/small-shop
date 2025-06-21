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
          ilike(products.name_en, `%${search}%`),
          ilike(products.name_ar, `%${search}%`),
          ilike(products.description_en, `%${search}%`),
          ilike(products.description_ar, `%${search}%`)
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

export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      company: true,
      images: true,
    },
  });
}

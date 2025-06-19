import "server-only";

import { db } from "@/db/drizzle";

export async function getCompanies() {
  try {
    return await db.query.companies.findMany({
      orderBy: (companies, { desc }) => [desc(companies.createdAt)],
    });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return [];
  }
}

export async function getProducts() {
  return await db.query.products.findMany({
    with: {
      images: true,
      company: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

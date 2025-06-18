import "server-only";

import { db } from "@/db/drizzle";

export async function getProducts() {
  return await db.query.products.findMany({
    with: {
      images: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

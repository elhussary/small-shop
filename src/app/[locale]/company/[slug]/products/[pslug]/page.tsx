import { notFound } from "next/navigation";

import ProductInfo from "@/components/product-info";
import { getProductBySlug } from "@/db/queires";

type paramsType = Promise<{ pslug: string }>;

export default async function ProductDetails(props: { params: paramsType }) {
  const { pslug } = await props.params;

  const product = await getProductBySlug(pslug);

  if (!product) {
    notFound();
  }

  //   const relatedProducts = await getRelatedProducts(id);

  return (
    <div className="container py-24">
      <ProductInfo product={product} />

      {/* <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
    </div>
  );
}

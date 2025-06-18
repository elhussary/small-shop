import AddProductDialog from "@/features/dashboard/components/products/add-product-dialog";
import ProductCard from "@/features/dashboard/components/products/product-card";
import { getProducts } from "@/features/dashboard/dashboadrd.queires";

export default async function DashboardProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6">
      <section className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <AddProductDialog />
      </section>

      {/* Products List */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

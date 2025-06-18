interface Product {
  id: number;
  name: string;
  price: string;
  description?: string | null;
  slug: string;
  images:
    | string[]
    | {
        id: number;
        url: string;
        productId: number;
      }[];
}

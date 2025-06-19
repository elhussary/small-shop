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
  companyId: number;

  company?: Company;
}

interface Company {
  name: string;
  description: string | null;
  slug: string;
  videoUrl: string;
  buttonText: string;
  id: number;
  createdAt: Date;
}

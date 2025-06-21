interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  price: string;
  description_en?: string | null;
  description_ar?: string | null;
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
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  slug: string;
  videoUrl: string;
  buttonText_en: string;
  buttonText_ar: string;
  createdAt: Date;
  updatedAt: Date;
}

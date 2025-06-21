"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLocalized } from "@/utils/getLocalized";
import { MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function CompanyProducts({
  company,
  products,
}: {
  company: Company;
  products: Product[];
}) {
  const locale = useLocale();
  const t = useTranslations("dashboard.products");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const name = getLocalized(product, "name", locale).toLowerCase();
      const description =
        getLocalized(product, "description", locale)?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      return name.includes(term) || description.includes(term);
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products, locale]);

  return (
    <div className="container py-24">
      <h1 className="text-3xl font-bold mb-2">
        {getLocalized(company, "name", locale)}
      </h1>

      <p className="text-muted-foreground mb-6">
        {getLocalized(company, "description", locale)}
      </p>

      <Input
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}

        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded">
            <Carousel>
              <CarouselContent>
                {product.images?.map((image, index) => (
                  <CarouselItem
                    key={
                      typeof image === "object" ? image.id : `${image}-${index}`
                    }
                    className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]"
                  >
                    <Link
                      href={`/company/${company.slug}/products/${product.slug}`}
                    >
                      <Image
                        src={typeof image === "object" ? image.url : image}
                        alt={product.name_en}
                        fill
                        loading="lazy"
                        className="object-contain"
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                variant={"secondary"}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
              />

              <CarouselNext
                variant={"secondary"}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              />
            </Carousel>

            {/* Product Details */}
            <section className="p-4">
              <h2 className="font-semibold text-lg mb-3">
                {getLocalized(product, "name", locale)}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                {getLocalized(product, "description", locale)}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">${product.price}</span>
                <Button
                  className="bg-green-400 text-black hover:bg-green-500"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `Hi! I'm interested in ${getLocalized(
                          product,
                          "name",
                          locale
                        )}`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <MessageCircle />
                  WhatsApp
                </Button>
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}

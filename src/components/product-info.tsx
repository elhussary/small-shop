"use client";

import { getLocalized } from "@/utils/getLocalized";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const ProductInfo = ({ product }: { product: Product }) => {
  const t = useTranslations("dashboard.products");
  const locale = useLocale();

  const [selectedImage, setSelectedImage] = useState<string | null>(
    product?.images?.[0]?.url
  );

  useEffect(() => {
    setSelectedImage(product.images?.[0]?.url || null);
  }, []);

  return (
    <section className="grid justify-center gap-8 sm:grid-cols-2">
      <div className="flex gap-2">
        {/* Thumbnails */}
        <section className="hidden flex-col gap-2 md:flex">
          {product.images?.map((img) => (
            <button
              key={img.id}
              onMouseEnter={() => setSelectedImage(img.url)}
              className="border-muted-foreground/20 relative h-25 w-15 overflow-hidden rounded border ring-gray-300 focus:ring-2 focus:outline-none"
            >
              <Image
                src={img.url || "/placeholder.svg"}
                alt={`${product.name_en} Image}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="!relative object-contain"
                priority
              />
            </button>
          ))}
        </section>

        {/* Gallery */}
        <section className="relative aspect-[2/3] w-full max-w-lg overflow-hidden shadow-md">
          <Image
            src={selectedImage || "/placeholder.svg"}
            alt={product.name_en}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="!relative rounded object-contain"
          />
        </section>
      </div>

      <div className="flex w-full items-baseline justify-between">
        <section className="w-full space-y-4">
          <div className="space-y-2.5">
            <h1 className="mb-4 text-3xl font-semibold">
              {getLocalized(product, "name", locale)}
            </h1>

            {/* Description */}
            <p className="mb-4">
              {getLocalized(product, "description", locale)}
            </p>

            {/* Company */}
            <p className="text-xs text-muted-foreground">
              {t("productCard.company")}:{" "}
              {product.company
                ? getLocalized(product.company, "name", locale)
                : "N/A"}
            </p>

            {/* Price */}
            <p className="text-2xl font-bold">${product.price}</p>
          </div>

          {/* Whats Up Button */}
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
        </section>

        {/* Add To cart */}
        <section className="flex items-center gap-2.5">
          <ShoppingCart />
        </section>
      </div>
    </section>
  );
};

export default ProductInfo;

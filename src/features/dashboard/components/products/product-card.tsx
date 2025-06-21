"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getLocalized } from "@/utils/getLocalized";
import { TrashIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { deleteProductAndImages } from "../../dashboard.actions";
import EditProductDialog from "./edit-product-dialog";

const ProductCard = ({
  product,
  companies,
}: {
  product: Product;
  companies: Company[];
}) => {
  const t = useTranslations("dashboard.products");
  const locale = useLocale();

  const handleDeleteProduct = async (productId: number) => {
    const result = await deleteProductAndImages(productId);

    if (result.success) {
      toast.success("Product deleted successfully.");
    } else {
      toast.error(result.error || "Failed to delete product.");
    }
  };

  return (
    <div className="border rounded-lg ">
      <Carousel>
        <CarouselContent>
          {product.images?.map((image, index) => (
            <CarouselItem
              key={typeof image === "object" ? image.id : `${image}-${index}`}
              className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]"
            >
              <Image
                src={typeof image === "object" ? image.url : image}
                alt={product.name_en}
                fill
                loading="lazy"
                className="object-contain"
              />
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

      <div className="flex justify-between items-start p-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-lg">
            {getLocalized(product, "name", locale)}
          </h3>
          <p className="font-semibold">${product.price}</p>
          <p className="text-xs text-muted-foreground">
            {getLocalized(product, "description", locale)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("productCard.company")}:{" "}
            {product.company
              ? getLocalized(product.company, "name", locale)
              : "N/A"}
          </p>
        </div>

        <div className="flex space-x-2 ml-4">
          <EditProductDialog product={product} companies={companies} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <TrashIcon />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  {t("actions.confirmDelete")} &quot;
                  {getLocalized(product, "name", locale)}
                  &quot;
                </AlertDialogTitle>

                <AlertDialogDescription>
                  {t("actions.deleteWarning")}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={() => handleDeleteProduct(product.id)}>
                    <TrashIcon className="w-4 h-4 mr-1" />
                    {t("actions.confirm")}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

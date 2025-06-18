"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { deleteProductAndImages } from "../../dashboard.actions";
import EditProductDialog from "./edit-product-dialog";

const ProductCard = ({ product }: { product: Product }) => {
  const handleDeleteProduct = async (productId: number) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

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
          {product.images.map((image) => (
            <CarouselItem key={typeof image === "object" ? image.id : image}>
              <Image
                src={typeof image === "object" ? image.url : image}
                fill
                priority
                alt={product.name}
                className="!relative w-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex justify-between items-start p-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="font-semibold">${product.price}</p>
          <p className="text-sm text-muted-foreground leading-6">
            {product.description}
          </p>
        </div>

        <div className="flex space-x-2 ml-4">
          <EditProductDialog product={product} />
          <Button
            onClick={() => handleDeleteProduct(product.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

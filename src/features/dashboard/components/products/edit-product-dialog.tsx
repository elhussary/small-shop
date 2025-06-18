"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { uploadFiles } from "@/lib/uploadthing";
import { productSchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, ImagePlus, InfoIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateProduct } from "../../dashboard.actions";

type ProductFormData = z.infer<typeof productSchema>;

const EditProductDialog = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description ?? "",
      slug: product.slug,
      images: product.images.map((img) =>
        typeof img === "string" ? img : img.url
      ),
    },
  });

  const { watch, setValue } = form;

  const nameValue = watch("name");
  useEffect(() => {
    // Only update slug if name is not empty
    if (nameValue) {
      setValue("slug", generateSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    toast.loading("Saving changes...");

    try {
      const newImageFiles = data.images.filter(
        (img): img is File => img instanceof File
      );
      const existingImageUrls = data.images.filter(
        (img): img is string => typeof img === "string"
      );

      let uploadedImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const uploadedResult = await uploadFiles("imageUploader", {
          files: newImageFiles,
        });
        uploadedImageUrls = uploadedResult.map((f) => f.url);
      }

      const finalProductData = {
        ...data,
        images: [...existingImageUrls, ...uploadedImageUrls],
      };

      const result = await updateProduct(product.id, finalProductData);

      if (result.success) {
        toast.success("Product updated successfully!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to update product.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during submission.");
      console.error(err);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Edit Product">
            <EditIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product details.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-3 space-y-4"
            >
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Premium T-Shirt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      URL Slug
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1.5 h-3 w-3 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Auto-generated from product name
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((img, i) => (
                        <div key={i} className="group relative">
                          <Image
                            src={
                              typeof img === "string"
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`Preview ${i + 1}`}
                            width={100}
                            height={100}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const updatedImages = field.value.filter(
                                (_, index) => index !== i
                              );
                              setValue("images", updatedImages, {
                                shouldValidate: true,
                              });
                            }}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <FormControl>
                        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card transition-colors hover:border-primary">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          <span className="mt-1 text-xs text-muted-foreground">
                            Add
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                // Append new files to the existing array in the form state
                                field.onChange([...field.value, ...files]);
                              }
                            }}
                          />
                        </label>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full !mt-6">
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditProductDialog;

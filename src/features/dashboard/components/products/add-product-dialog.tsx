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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ImagePlus, InfoIcon, PlusCircle, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addProduct } from "../../dashboard.actions";

type ProductFormData = z.infer<typeof productSchema>;

const AddProductDialog = ({ companies }: { companies: Company[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "0",
      description: "",
      slug: "",
      images: [],
      companyId: undefined,
    },
  });

  const { watch, setValue, control, handleSubmit, formState } = form;

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue), { shouldValidate: true });
    } else {
      setValue("slug", "", { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    const toastId = toast.loading("Adding product, please wait...");

    try {
      const imageFiles = data.images as File[];

      const uploadedImageResults = await uploadFiles("imageUploader", {
        files: imageFiles,
      });

      const finalProductData = {
        ...data,
        images: uploadedImageResults.map((res) => res.ufsUrl),
      };

      const result = await addProduct(finalProductData);

      if (result.success) {
        toast.success("Product added successfully!", { id: toastId });
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to add product.", { id: toastId });
      }
    } catch (err) {
      console.error("Product creation failed:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle />
          Add New Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new product.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
            {/* Product Name */}
            <FormField
              control={control}
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
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    URL Slug
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1.5 h-3 w-3 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Auto-generated from product name
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
              control={control}
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
              control={control}
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

            {/* Company */}
            <FormField
              control={control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Uploader */}
            <FormField
              control={control}
              name="images"
              render={({ field }) => (
                <FormItem className="mt-7 space-y-2">
                  <FormLabel>Product Images</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {field.value.map((img, i) => (
                      <div key={i} className="group relative">
                        <Image
                          src={URL.createObjectURL(img as File)} // All images are Files for a new product
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

            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full !mt-6"
            >
              {formState.isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;

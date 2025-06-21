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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFiles } from "@/lib/uploadthing";
import { createProductSchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";
import { getLocalized } from "@/utils/getLocalized";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, ImagePlus, InfoIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateProduct } from "../../dashboard.actions";

const EditProductDialog = ({
  product,
  companies,
}: {
  product: Product;
  companies: Company[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations("dashboard.products.form");
  const schema = createProductSchema(t);
  type ProductFormData = z.infer<typeof schema>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en,
      description_ar: product.description_ar,
      price: product.price,
      slug: product.slug,
      images: product.images.map((img) =>
        typeof img === "string" ? img : img.url
      ),
      companyId: product.companyId,
    },
  });

  const { watch, setValue, control, formState } = form;

  const nameEn = watch("name_en");

  useEffect(() => {
    setValue("slug", generateSlug(nameEn));
  }, [nameEn, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    const toastId = toast.loading(t("actions.editSubmitting"));

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
        toast.success(t("success.edit"), { id: toastId });
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to update product.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during submission.");
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
            <DialogTitle>{t("editProduct")}</DialogTitle>
            <DialogDescription>{t("enterDetails")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-3 space-y-4"
            >
              {/* Product Name EN */}
              <FormField
                control={control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.nameEn")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("fields.nameEn")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Name AR */}
              <FormField
                control={control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.nameAr")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("fields.nameAr")} {...field} />
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
                      {t("fields.slug")}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="ml-1.5 h-3 w-3 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("fields.slugTooltip")}
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
                    <FormLabel>{t("fields.price")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description EN */}
              <FormField
                control={control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.descriptionEn")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description AR */}
              <FormField
                control={control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.descriptionAr")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} value={field.value || ""} />
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
                    <FormLabel>{t("fields.company")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.company")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {getLocalized(company, "name", locale)}
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
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.images")}</FormLabel>
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

              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full !mt-6"
              >
                {formState.isSubmitting
                  ? t("actions.editSubmitting")
                  : t("editProduct")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditProductDialog;

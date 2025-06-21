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
import { createProductSchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";
import { getLocalized } from "@/utils/getLocalized";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, InfoIcon, PlusCircle, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addProduct } from "../../dashboard.actions";

const AddProductDialog = ({ companies }: { companies: Company[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations("dashboard.products.form");
  const schema = createProductSchema(t);
  type ProductFormData = z.infer<typeof schema>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      price: "0",
      slug: "",
      images: [],
      companyId: undefined,
    },
  });

  const { watch, setValue, control, handleSubmit, formState } = form;

  const nameEn = watch("name_en");

  useEffect(() => {
    setValue("slug", generateSlug(nameEn));
  }, [nameEn, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    const toastId = toast.loading(t("actions.submitting"));

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
        toast.success(t("actions.add"), { id: toastId });
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to add product.", { id: toastId });
      }
    } catch (err) {
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
          {t("addProduct")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addNewProduct")}</DialogTitle>
          <DialogDescription>{t("enterDetails")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
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
              control={control}
              name="images"
              render={({ field }) => (
                <FormItem className="mt-7 space-y-2">
                  <FormLabel>{t("fields.images")}</FormLabel>
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
              {formState.isSubmitting
                ? t("actions.submitting")
                : t("actions.submit")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;

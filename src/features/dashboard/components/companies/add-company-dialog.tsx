"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addCompany } from "@/features/dashboard/dashboard.actions";
import { createCompanySchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const AddCompanyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("dashboard.companies.form");
  const schema = createCompanySchema(t);
  type CompanyFormData = z.infer<typeof schema>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      description_en: null,
      description_ar: null,
      slug: "",
      videoUrl: "",
      buttonText_en: "",
      buttonText_ar: "",
    },
  });

  const { control, handleSubmit, formState, reset, watch, setValue } = form;
  const nameEn = watch("name_en");
  useEffect(() => {
    setValue("slug", generateSlug(nameEn), { shouldValidate: false });
  }, [nameEn, setValue]);

  useEffect(() => {
    setValue("slug", generateSlug(nameEn), { shouldValidate: false });
  }, [nameEn, setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    const toastId = toast.loading(t("actions.submitting"));

    try {
      const result = await addCompany(data);

      if (result.success) {
        toast.success(t("success.add"), { id: toastId });
        reset();
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to add company.", { id: toastId });
      }
    } catch (err) {
      toast.error("Unexpected error. Please try again.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {t("addCompany")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNewCompany")}</DialogTitle>
          <DialogDescription>{t("enterDetails")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
            {/* Name EN */}
            <FormField
              control={control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyNameEn")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. GreenLife Organics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name AR */}
            <FormField
              control={control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyNameAr")}</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="مثال: جرين لايف أورجانيكس"
                      {...field}
                    />
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
                    {t("fields.slug")}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1.5 h-3 w-3 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{t("fields.slugTooltip")}</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
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
                    <Textarea rows={4} {...field} value={field.value || ""} />
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
                    <Textarea
                      rows={4}
                      dir="rtl"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video URL */}
            <FormField
              control={control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.videoUrl")}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button Text EN */}
            <FormField
              control={control}
              name="buttonText_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.buttonTextEn")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Shop Now" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button Text AR */}
            <FormField
              control={control}
              name="buttonText_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.buttonTextAr")}</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: تسوق الآن" dir="rtl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full mt-5"
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

export default AddCompanyDialog;

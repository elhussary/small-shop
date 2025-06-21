"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateCompany } from "@/features/dashboard/dashboard.actions";
import { createCompanySchema } from "@/lib/zodSchemas";
import { generateSlug } from "@/utils/generateSlug";

const EditCompanyDialog = ({ company }: { company: Company }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("dashboard.companies.form");
  const schema = createCompanySchema(t);
  type CompanyFormData = z.infer<typeof schema>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: company.name_en,
      name_ar: company.name_ar,
      slug: company.slug,
      description_en: company.description_en || "",
      description_ar: company.description_ar || "",
      videoUrl: company.videoUrl,
      buttonText_en: company.buttonText_en,
      buttonText_ar: company.buttonText_ar,
    },
  });

  const nameEn = form.watch("name_en");

  useEffect(() => {
    form.setValue("slug", generateSlug(nameEn), { shouldValidate: true });
  }, [nameEn, form.setValue]);

  const onSubmit = async (data: CompanyFormData) => {
    const toastId = toast.loading(t("actions.editSubmitting"));
    try {
      const result = await updateCompany(company.id, data);
      if (result.success) {
        toast.success(t("success.edit"), { id: toastId });
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to update company.", {
          id: toastId,
        });
      }
    } catch (err) {
      toast.error("Unexpected error.", { id: toastId });
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded border px-3 py-1 text-sm gap-1.5"
            aria-label="Edit Company"
          >
            <EditIcon className="h-4 w-4" />{" "}
            {t("editCompany", { defaultValue: "Edit" })}
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCompany")}</DialogTitle>
            <DialogDescription>{t("enterDetails")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-3"
            >
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.companyNameEn")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.companyNameAr")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <TooltipContent>
                          {t("fields.slugTooltip")}
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

              <FormField
                control={form.control}
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
              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.videoUrl")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.buttonTextEn")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buttonText_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.buttonTextAr")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                {t("editCompany")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditCompanyDialog;

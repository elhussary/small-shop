import { z } from "zod";

export const createProductSchema = (
  t: (key: string, options?: any) => string
) =>
  z.object({
    name_en: z.string().min(1, { message: t("errors.required") }),
    name_ar: z.string().min(1, { message: t("errors.required") }),

    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: t("errors.invalidPriceFormat"),
      })
      .refine((val) => parseFloat(val) > 0, {
        message: t("errors.priceGreaterThanZero"),
      }),

    description_en: z.string().nullable(),
    description_ar: z.string().nullable(),

    slug: z.string().min(1, { message: t("errors.required") }),

    images: z
      .array(z.union([z.string(), z.instanceof(File)]))
      .min(1, { message: t("errors.atLeastOneImage") }),

    companyId: z.number().min(1, { message: t("errors.required") }),
  });

export const createCompanySchema = (
  t: (key: string, options?: any) => string
) =>
  z.object({
    name_en: z.string().min(1, { message: t("errors.required") }),
    name_ar: z.string().min(1, { message: t("errors.required") }),
    description_en: z.string().nullable(),
    description_ar: z.string().nullable(),
    slug: z.string().min(1, { message: t("errors.required") }),
    videoUrl: z.string().url({ message: t("errors.invalidUrl") }),
    buttonText_en: z.string().min(1, { message: t("errors.required") }),
    buttonText_ar: z.string().min(1, { message: t("errors.required") }),
  });

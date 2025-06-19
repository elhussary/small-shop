import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .refine((val) => parseFloat(val) > 0, {
      message: "Price must be greater than 0",
    }),
  description: z.string().optional(),
  slug: z.string(),
  images: z
    .array(z.union([z.string(), z.instanceof(File)]))
    .min(1, "At least one image is required"),
  companyId: z.coerce.number().min(1, "Company is required"),
});

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string(),
  videoUrl: z.string().url("Video URL must be valid"),
  buttonText: z.string().min(1, "Button text is required"),
});

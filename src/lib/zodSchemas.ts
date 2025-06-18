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
});

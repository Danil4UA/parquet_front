import { z } from "zod";

export const productSchema = z.object({
  name: z.object({
    en: z.string().min(3, { message: "Name must be at least 3 characters" }),
    ru: z.string().min(3, { message: "Name must be at least 3 characters" }),
    he: z.string().min(3, { message: "Name must be at least 3 characters" }),
  }),
  detailedDescription: z.object({
    en: z.string(),
    ru: z.string(),
    he: z.string(),
  }),
  category: z.string(),
  color: z.string(),
  countryOfOrigin: z.string().optional(),
  discount: z.number().min(0).max(100),
  finish: z.string(),
  isAvailable: z.boolean(),
  length: z.number().optional().nullable(),
  model: z.string(),
  price: z.number(),
  stock: z.number().int().min(0),
  thickness: z.number().optional().nullable(),
  type: z.string().optional(),
  width: z.number().optional().nullable(),
  boxCoverage: z.number().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
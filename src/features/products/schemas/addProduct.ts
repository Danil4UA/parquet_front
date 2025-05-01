import * as z from 'zod';

export const multilingualStringSchema = z.object({
  en: z.string().min(1, { message: "English translation is required" }),
  ru: z.string().min(1, { message: "Russian translation is required" }),
  he: z.string().min(1, { message: "Hebrew translation is required" }),
});

export const productSchema = z.object({
  name: multilingualStringSchema,
  description: multilingualStringSchema,
  detailedDescription: multilingualStringSchema,
  price: z.string().min(1, { message: "Price is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  discount: z.number().int().min(0).max(100).default(0),
  isAvailable: z.boolean().default(true),
  color: z.string().optional(),
  boxCoverage: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  finish: z.string().optional(),
  width: z.string().optional(),
  length: z.string().optional(),
  thickness: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  images: z.array(z.any()).default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
import { z } from "zod";

export type OrderFormType = {
  name: string;
  lastName: string;
  phoneNumber: string;
  deliveryMethod: "shipping" | "pickup";
  address?: string;
  apartment?: string;
  postalCode?: string;
  city?: string;
  cartItems?: Array<{
    name: string;
    quantity: number;
  }>;
};

export const orderFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("errors.nameRequired")),
  lastName: z.string().min(1, t("errors.lastNameRequired")),
  phoneNumber: z.string().min(1, t("errors.phoneRequired")),
  deliveryMethod: z.enum(["shipping", "pickup"]),
  address: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  cartItems: z.array(
    z.object({
      name: z.string(),
      quantity: z.number()
    })
  ).optional()
}).refine((data) => {
  if (data.deliveryMethod === "shipping") {
    return !!data.address && data.address.trim().length > 0;
  }
  return true;
}, {
  message: t("errors.addressRequired"),
  path: ["address"]
});
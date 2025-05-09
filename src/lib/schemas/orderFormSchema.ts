import { z } from "zod";

export const orderFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
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
    message: "Address is required for shipping",
    path: ["address"]
  });

export type OrderFormType = z.infer<typeof orderFormSchema>;
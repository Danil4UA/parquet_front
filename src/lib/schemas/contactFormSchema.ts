import { z } from "zod";

export const contactFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t("errors.name_min_length") }),
  phone: z.string().min(5, { message: t("errors.phone_invalid") }),
  email: z.string().email({ message: t("errors.email_invalid") }),
  message: z.string().min(10, { message: t("errors.message_min_length") })
});

export type ContactFormType = {
  name: string;
  phone: string;
  email: string;
  message: string;
}
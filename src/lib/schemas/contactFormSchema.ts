import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  phone: z.string().min(5, { message: "Введите корректный номер телефона" }),
  email: z.string().email({ message: "Введите корректный email" }),
  message: z.string().min(10, { message: "Сообщение должно содержать минимум 10 символов" })
});

export type ContactFormType = z.infer<typeof contactFormSchema>;
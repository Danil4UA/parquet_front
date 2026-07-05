"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logoBlack from "@/app/logo_transparent_black.png";
import logoWhite from "@/app/logo_transparent.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import userServices from "@/services/userServices";

const inputErrorStyles = "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive";

function LoginForm() {
  const t = useTranslations("Login");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
    ? rawCallback
    : `/${locale}/admin`;

  const loginSchema = z.object({
    email: z.string().min(1, t("email_required")).email(t("email_invalid")),
    password: z.string().min(1, t("password_required")).min(6, t("password_min")),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const result = await userServices.login(values.email, values.password);

      if (result.success) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      if (result.message === "CredentialsSignin") {
        toast.error(t("invalid_credentials"));
      } else {
        toast.error(t("server_error"));
      }
    } catch {
      toast.error(t("server_error"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t("email_placeholder")}
                  className={`h-10 ${inputErrorStyles}`}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("password_placeholder")}
                    className={`h-10 pe-10 ${inputErrorStyles}`}
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t("hide_password") : t("show_password")}
                    className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("signing_in")}
            </>
          ) : (
            t("sign_in")
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function LoginPage() {
  const t = useTranslations("Login");

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      {/* Form column */}
      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center gap-2">
          <Image src={logoBlack} alt="" width={40} height={40} />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{t("brand")}</p>
            <p className="text-xs text-muted-foreground">{t("admin_panel")}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight">{t("welcome_back")}</h1>
            <p className="mt-1.5 mb-8 text-sm text-muted-foreground">{t("subtitle")}</p>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Brand panel — desktop only */}
      <div className="relative hidden lg:block bg-gradient-to-br from-black via-neutral-900 to-neutral-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src={logoWhite} alt="" width={220} height={220} priority />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="max-w-md text-2xl font-semibold leading-snug">
            {t("brand_quote")}
          </p>
          <p className="mt-3 max-w-md text-sm text-white/75">
            {t("brand_quote_sub")}
          </p>
        </div>
      </div>
    </div>
  );
}

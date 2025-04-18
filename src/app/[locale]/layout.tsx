import "./global.css"
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { getLanguageMetadata } from "../metadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getLanguageMetadata(locale as "en" | "ru" | "he");
}

export default async function RootLayout({
  children,
  params,
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  
  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <body>
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
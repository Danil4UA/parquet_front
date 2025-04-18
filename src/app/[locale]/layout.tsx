import "./global.css"
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { getLanguageMetadata } from "../metadata";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return getLanguageMetadata(locale as "en" | "ru" | "he");
}

export default async function RootLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    return notFound();
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
};

import "@/app/global.css"
import "@/app/tailwind.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { getLanguageMetadata } from "../metadata";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Script from 'next/script';

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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16970698709"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16970698709');
          `}
        </Script>
      </head>
      <body>
        <ReactQueryProvider>
          <ReduxProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
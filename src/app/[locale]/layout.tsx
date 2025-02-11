import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/redux/ReduxProvider";
import CartLoader from "@/components/CartLoader/CartLoader";
import ProductFilterLoader from "@/components/Products/ui/ProductFilterLoader/ProductFilterLoader";
import ClientCart from "@/components/Cart/ui/ClientCart/ClientCart";
import { getLanguageMetadata } from "../metadata";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return getLanguageMetadata(locale as "en" | "ru" | "he");
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
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
            <CartLoader />
            <ProductFilterLoader />
            <Navbar />
            <ClientCart />
            <div className="content-page">
              <div className="page-wrapper">{children}</div>
            </div>
            <Footer />
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://effectparquet.com"),

  title: {
    template: "%s | Effect Parquet",
    default: "Effect Parquet - Premium Flooring Solutions"
  },
  description: "Premium quality parquet flooring, panels, and wooden solutions. International delivery available.",

  openGraph: {
    type: "website",
    siteName: "Effect Parquet",
    locale: "en_US",
    alternateLocale: ["ru_RU", "he_IL"],
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Effect Parquet - Premium Flooring Solutions"
      }
    ]
  },
  category: "home goods store",
  verification: {
    google: "L8LwCwBuHnPSFkzASPa37yA-ShXSVycV7ESncp0BDww"
  },

  twitter: {
    card: "summary_large_image",
    title: "Effect Parquet - Premium Flooring Solutions",
    description: "Premium quality parquet flooring, panels, and wooden solutions.",
    images: ["/twitter-image.jpg"]
  },

  alternates: {
    canonical: "https://effectparquet.com",
    languages: {
      en: "https://effectparquet.com/en",
      ru: "https://effectparquet.com/ru",
      he: "https://effectparquet.com/he"
    }
  },

  keywords: "parquet, wooden flooring, hardwood floors, wooden panels, flooring solutions",
  authors: [{ name: "Effect Parquet" }],
  generator: "Next.js",
  applicationName: "Effect Parquet",
  referrer: "origin-when-cross-origin",
  creator: "Effect Parquet",
  publisher: "Effect Parquet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const translations = {
  en: {
    title: "Effect Parquet - Premium Flooring Solutions",
    description: "Premium quality parquet flooring, panels, and wooden solutions.",
    keywords: "parquet, wooden flooring, hardwood floors, wooden panels, flooring solutions"
  },
  ru: {
    title: "Effect Parquet - Премиальные Решения для Паркета",
    description: "Паркет премиального качества, панели и деревянные решения.",
    keywords: "паркет, деревянные полы, массив, панели, напольные покрытия"
  },
  he: {
    title: "Effect Parquet - פתרונות פרקט יוקרתיים",
    description: "פרקט איכותי, פנלים ופתרונות עץ.",
    keywords: "פרקט, רצפת עץ, רצפת עץ קשה, פנלים מעץ, פתרונות ריצוף"
  }
};

export function getLanguageMetadata(lang: string): Metadata {
  if (!["en", "ru", "he"].includes(lang)) {
    lang = "en";
  }

  const translation = translations[lang];
  if (!translation) {
    console.error(`Translation not found for language: ${lang}`);
    return getLanguageMetadata("en");
  }

  return {
    ...metadata,
    title: translation.title,
    description: translation.description,
    keywords: translation.keywords,
    openGraph: {
      ...metadata.openGraph,
      locale: lang === "en" ? "en_US" : lang === "ru" ? "ru_RU" : "he_IL",
      title: translation.title,
      description: translation.description
    }
  };
}

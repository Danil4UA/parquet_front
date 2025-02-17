import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://effectparquet.com"),

  // Default title and description (can be overridden by page-specific metadata)
  title: {
    template: "%s | Effect Parquet",
    default: "Effect Parquet - Premium Flooring Solutions"
  },
  description: "Premium quality parquet flooring, panels, and wooden solutions. International delivery available.",

  // OpenGraph metadata
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

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Effect Parquet - Premium Flooring Solutions",
    description: "Premium quality parquet flooring, panels, and wooden solutions.",
    images: ["/twitter-image.jpg"]
  },

  // Alternate language versions
  alternates: {
    canonical: "https://effectparquet.com",
    languages: {
      en: "https://effectparquet.com/en",
      ru: "https://effectparquet.com/ru",
      he: "https://effectparquet.com/he"
    }
  },

  // Additional metadata
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

  // Robots metadata
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

// Translations for different languages
export const translations = {
  en: {
    title: "Effect Parquet - Premium Flooring Solutions",
    description: "Premium quality parquet flooring, panels, and wooden solutions. International delivery available.",
    keywords: "parquet, wooden flooring, hardwood floors, wooden panels, flooring solutions"
  },
  ru: {
    title: "Effect Parquet - Премиальные Решения для Паркета",
    description: "Паркет премиального качества, панели и деревянные решения. Доступна международная доставка.",
    keywords: "паркет, деревянные полы, массив, панели, напольные покрытия"
  },
  he: {
    title: "Effect Parquet - פתרונות פרקט יוקרתיים",
    description: "פרקט איכותי, פנלים ופתרונות עץ. משלוח בינלאומי זמין.",
    keywords: "פרקט, רצפת עץ, רצפת עץ קשה, פנלים מעץ, פתרונות ריצוף"
  }
};

// Helper function to get metadata for specific language
export function getLanguageMetadata(lang): Metadata {
  // Проверяем, что lang является допустимым значением
  if (!["en", "ru", "he"].includes(lang)) {
    // Если язык неверный, используем английский как запасной вариант
    lang = "en";
  }

  const translation = translations[lang];
  if (!translation) {
    console.error(`Translation not found for language: ${lang}`);
    // Используем английский как запасной вариант
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

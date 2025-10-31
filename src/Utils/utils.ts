import RouteConstants from "@/constants/RouteConstants";
import { FilterCategoryConfig, Product } from "@/types/products";
import parsePhoneNumber, {
  CountryCode,
  formatIncompletePhoneNumber, isValidPhoneNumber,
} from "libphonenumber-js";

export const socialLinks = {
    instagram: "https://www.instagram.com/effectparquet?igsh=MTZwMWpwM2V3c2w2dQ==",
    facebook: "https://www.facebook.com/share/18rNsCJ3sR/?mibextid=wwXIfr",
    whatsapp: "https://wa.me/+972584455478",
    waze: "https://waze.com/ul?q=110+Herzl+Street+Rishon+LeZion&navigate=yes"
};


export const contactData = {
    email: "effectparquet@gmail.com",
    phone: "058-44-55-478",
    address: "הרצל 110, ראשון לציון"
};

export const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

export const isStartsWithRoute = (specificItem, pathname) => {
    if (specificItem.disabled) return false;
    if (specificItem.route === RouteConstants.HOMEPAGE_ROUTE) {
      return pathname === specificItem.route;
    }
    return pathname.startsWith(specificItem.route);
  }
export const ValidPageSizes = [10, 20, 30, 50];

export default class Utils {
  static formatDateString(date, includeTime = false) {
    if (!date) return '';
    
    const newDate = new Date(date);
    
    if (isNaN(newDate.getTime())) return 'Invalid Date';
    
    if (includeTime) {
      return newDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });
    }

    return newDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  static formatPhoneNumber = (
    phoneNumber: string | number,
    defaultCountry: CountryCode = "IL"
  ) => {
    if (!phoneNumber) return "";

    try {
      let cleanedNumber = String(phoneNumber);

      if (cleanedNumber.startsWith("+")) {
        cleanedNumber = `+${cleanedNumber.slice(1).replace(/\D/g, "")}`;
      } else {
        cleanedNumber = cleanedNumber.replace(/\D/g, "");
      }
      const parsedNumber = parsePhoneNumber(cleanedNumber, defaultCountry);
      if (parsedNumber && isValidPhoneNumber(parsedNumber.number)) {
        return parsedNumber.formatInternational();
      }

      return formatIncompletePhoneNumber(cleanedNumber, defaultCountry);
    } catch {
      return phoneNumber;
    }
  };

  static moreReviewsLink = "https://www.google.com/search?q=אפקט הפרקט Reviews";

  static filterCategoryConfig: Record<string, FilterCategoryConfig> = {
    all: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: []
    },
    cladding: {
      showColorFilter: true,
      showTypeFilter: false,
      excludeTypes: []
    },
    laminate: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["laminate", "cladding"]
    },
    wood: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["cladding", "laminate"]
    },
    spc: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["cladding", "laminate"]
    },
    default: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: []
    }
  }

  static generateProductSchema = (product: Product, productPriceWithDiscount: number) => {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description || product.detailedDescription,
      "sku": product.model || product._id,
      "mpn": product.model,
      "brand": {
        "@type": "Brand",
        "name": "Effect Parquet"
      },
      "offers": {
        "@type": "Offer",
        "url": typeof window !== 'undefined' ? window.location.href : '',
        "priceCurrency": "ILS",
        "price": productPriceWithDiscount.toFixed(2),
        "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 днів
        "availability": product.isAvailable && product.stock > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Effect Parquet"
        }
      }
    };

    if (product.color) {
      schema["color"] = product.color;
    }

    if (product.length && product.width) {
      schema["depth"] = {
        "@type": "QuantitativeValue",
        "value": product.length,
        "unitCode": "MMT"
      };
      schema["width"] = {
        "@type": "QuantitativeValue",
        "value": product.width,
        "unitCode": "MMT"
      };
    }

    if (product.thickness) {
      schema["height"] = {
        "@type": "QuantitativeValue",
        "value": product.thickness,
        "unitCode": "MMT"
      };
    }

    const additionalProperties: any[] = [];

    if (product.finish) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Finish",
        "value": product.finish
      });
    }

    if (product?.installationType) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Installation Type",
        "value": product?.installationType
      });
    }

    if (product.boxCoverage) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Box Coverage",
        "value": product.boxCoverage,
        "unitText": "m²"
      });
    }

    if (additionalProperties.length > 0) {
      schema["additionalProperty"] = additionalProperties;
    }

    if (product.category) {
      schema["category"] = product.category;
    }

    return schema;
  };
}
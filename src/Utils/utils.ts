import RouteConstants from "@/constants/RouteConstants";
import parsePhoneNumber, {
  CountryCode,
  formatIncompletePhoneNumber, isValidPhoneNumber,
} from "libphonenumber-js";

export const socialLinks = {
    instagram: "https://www.instagram.com/effectparquet?igsh=MTZwMWpwM2V3c2w2dQ==",
    facebook: "https://www.facebook.com/share/18rNsCJ3sR/?mibextid=wwXIfr"
};


export const contactData = {
    email: "effectparquet@gmail.com",
    phone: "0584455478",
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
}
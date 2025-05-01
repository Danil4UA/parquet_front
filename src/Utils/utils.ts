import RouteConstants from "@/constants/RouteConstants";

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

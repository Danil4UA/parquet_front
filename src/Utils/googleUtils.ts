export const pushEcommerceEvent = (eventName: string, ecommerceData: any) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({ ecommerce: null });

  window.dataLayer.push({
    event: eventName,
    ecommerce: ecommerceData,
  });

};

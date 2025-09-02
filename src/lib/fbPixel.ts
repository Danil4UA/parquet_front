export const fbTrack = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackAddToCart = (
  productId: string, 
  pricePerMeter: number, 
  quantity: number
) => {
  const totalValue = pricePerMeter * quantity;
  
  fbTrack('AddToCart', {
    content_ids: [productId],
    content_type: 'product',
    value: totalValue, 
    currency: 'ILS',
    quantity: quantity,
    content_name: `Product ${productId}`
  });
};

export const trackViewContent = (productId: string, value?: number) => {
  const parameters: any = {
    content_ids: [productId],
    content_type: 'product',
  };
  
  if (value) {
    parameters.value = value;
    parameters.currency = 'ILS';
  }
  
  fbTrack('ViewContent', parameters);
};

export const trackSearch = (searchTerm: string) => {
  fbTrack('Search', {
    search_string: searchTerm
  });
};

export const trackInitiateCheckout = (cartItems: any[], totalQuantity: number, totalPrice: number) => {
  fbTrack('InitiateCheckout', {
    content_ids: cartItems,
    content_type: 'product',
    value: totalPrice,
    currency: 'ILS',
    quantity: totalQuantity,
    num_items: cartItems.length
  });
};


export const trackPurchase = (value: number, orderId?: string) => {
  fbTrack('Purchase', {
    value: value,
    currency: 'ILS',
    content_ids: orderId ? [orderId] : [],
    content_type: 'product'
  });
};
export const isFbPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.fbq;
};

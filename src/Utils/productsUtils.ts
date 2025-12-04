import { Product } from "@/types/products";

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'he', name: 'Hebrew' }
  ];
  
export const CATEGORIES = ['Laminate', 'SPC'];


export const COLORS = ['Brown', 'Gray', 'Beige', 'White', 'Black', 'Natural', 'Red', 'Other'];

export const translatableFields = ['name', 'description', 'detailedDescription'];

export const colorOptions = [
  { id: 'Brown', name: 'Brown' },
  { id: 'Gray', name: 'Gray' },
  { id: 'Smoke', name: 'Smoke' },
  { id: 'Beige', name: 'Beige' },
  { id: 'Dark', name: 'Dark' }
]
export const categoryOptions = [
  { id: "SPC", name: 'SPC' },
  { id: "Wood", name: 'Wood' },
  { id: "Laminate", name: 'Laminate' },
  { id: "Cladding", name: 'Cladding' },
  { id: "Panels", name: 'Panels' },
  { id: "Cleaning", name: 'Cleaning' },
]

export const allowedTypes = [
  { id: "Fishbone", name: 'Fishbone' },
  { id: "Plank", name: 'Plank' },
  { id: "Cladding", name: 'Cladding' },
]

export const stockOptions = [
  { id: "true", name: "Yes"},
  { id: "false", name: "No"},
]

export const availableOptions = [
  { id: "true", name: "Yes"},
  { id: "false", name: "No"},
]

export const prepareProductData = (product) => {
  const formattedProduct = { ...product };
  
  ['length', 'width', 'thickness', 'price', 'stock', 'discount'].forEach(field => {
    if (product[field] !== undefined && product[field] !== null) {
      const numValue = Number(product[field]);
      if (!isNaN(numValue)) {
        formattedProduct[field] = numValue;
      }
    }
  });
  
  return formattedProduct;
};

export const calculateDiscountedPrice = (product: Product): number => {
  return product?.discount 
    ? Number(product.price) * ((100 - product?.discount) / 100) 
    : Number(product?.price);
};

export const formatPrice = (price: number): string => {
  return `₪${price.toFixed(0)}`;
};

export const calculateBoxPrice = (pricePerSqm: number, boxCoverage: number): number => {
  return Number((pricePerSqm * boxCoverage).toFixed(2));
};

export const hasBoxCoverage = (product: Product): boolean => {
  return !!(product.boxCoverage && Number(product.boxCoverage) > 0);
};


export const getProductAnalyticsItem = (product: Product, price: number) => {
  return {
    item_id: product._id,
    item_name: product.name,
    price: price,
    item_category: product.category,
    item_variant: product.model,
  };
};

export const createAddToCartEvent = (product: Product, quantity: number = 1) => {
  const price = calculateDiscountedPrice(product);
  const value = price * quantity;

  return {
    event: "add_to_cart",
    ecommerce: {
      currency: "ILS",
      value: value,
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          price: price,
          quantity: quantity,
          item_variant: product.model,
          currency: "ILS"
        }
      ]
    }
  };
};

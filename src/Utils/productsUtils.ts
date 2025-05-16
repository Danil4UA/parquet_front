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
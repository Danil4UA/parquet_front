export interface Product {
    _id: string;
    name: string;
    description: string;
    detailedDescription: string;
    price: string;
    images: string[];
    category: string;
    stock: number;
    discount: number;
    isAvailable: boolean;
    color: string;
    type: string;
    material: string;
    countryOfOrigin: string;
    width?: string;
    length?: string;
    company?: string;
    thickness?: string
    model: string
    finish: string
  }
  
export interface ProductsSearchParams {
    category?: string;
    search?: string;
    color?: string;
    type?: string;
    language?: string;
    page?: number;
    limit?: number;
  }
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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
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

export interface ProductsWithPagination {
    pagination: Pagination;
    products: Product[];
}

export interface Color {
  name: string
}

export interface Category {
  name: string
}
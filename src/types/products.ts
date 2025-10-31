export interface MultiLanguageProperty {
  en: string;
  ru: string;
  he: string;
}
export interface FullProduct {
  id: string;
  name: MultiLanguageProperty;
  description: MultiLanguageProperty;
  detailedDescription: MultiLanguageProperty;
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
  width?: number;
  length?: number;
  company?: string;
  thickness?: number
  model: string
  finish: string
  boxCoverage?: number;
}

export interface FullProductResponse {
  product: FullProduct;
  message: string;
}
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
    boxCoverage?: number;
    installationType?: string;
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
    isRandom?: string;
    sortBy?: string;
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

export interface ProductByCategory {
  category: string
  count: number
}

export interface DashboardStats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  canceledOrders: number
  totalProducts: number
  successRate: string
  ordersThisWeek: number
}

export type FilterCategoryConfig = {
  showColorFilter: boolean;
  showTypeFilter: boolean;
  excludeTypes: string[];
}
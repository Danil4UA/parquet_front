export interface StatusOption {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type CartItem = {
    id: string;
    name: string;
    model: string;
    quantity: string;
}
export interface Order {
    _id: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    status: string;
    paymentStatus: string;
    deliveryMethod: string;
    createdAt: string;
    notes: string;
    cartItems: CartItem[]
    totalPrice: number;
    address: string;
    apartment: string;
    postalCode: string;
    city: string;
}

export interface OrdersSearchParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface OrdersWithPagination {
    orders: Order[],
    pagination: Pagination;
}

export interface OrderStatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface OrderTimeline {
  data: string;
  orders: number;
}

export interface OrderTimeLineParams {
  days?: number;
  all?: string;
}
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


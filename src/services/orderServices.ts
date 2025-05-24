import "dotenv/config";
import axios from "axios";
import { OrdersSearchParams } from "@/types/orders";
import { Session } from "next-auth";
const URL_API = process.env.NEXT_PUBLIC_URL_API;
 
class OrderService {
    static ALL_ORDERS_ENDPOINT = `${URL_API}/api/admin/orders`;

    static SPECIFIC_ORDER_ENDPOINT = `${URL_API}/api/admin/order`;

    static getAllOrders = async (session: Session, params: OrdersSearchParams) => {
        const { accessToken } = session ?? {};

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                ...params
            }
        };
        try {
            return await axios.get(OrderService.ALL_ORDERS_ENDPOINT, config);
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    static editOrder = async (session: Session | null, orderData) => {
        const { accessToken } = session ?? {};

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }

        try {
            return await axios.patch(
                OrderService.SPECIFIC_ORDER_ENDPOINT,
                orderData,
                config,
            );
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    static deleteOrder = async (session: Session | null, orderId: string) => {
        const { accessToken } = session ?? {};
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        try {
            return await axios.delete(
                `${OrderService.SPECIFIC_ORDER_ENDPOINT}/${orderId}`, 
                config
            );
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }
}

export default OrderService
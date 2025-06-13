import "dotenv/config";
import axios from "axios";
import { OrdersSearchParams, OrderTimeLineParams } from "@/types/orders";
import { Session } from "next-auth";
const URL_API = process.env.NEXT_PUBLIC_URL_API;
 
class OrderService {
    static ALL_ORDERS_ENDPOINT = `${URL_API}/api/admin/orders`;

    static SPECIFIC_ORDER_ENDPOINT = `${URL_API}/api/admin/order`;

    static ALL_ORDER_STATUSES_DISTRIBUTION = `${URL_API}/api/admin/order-status-distribution`;

    static ALL_ORDERS_TIMELINE = `${URL_API}/api/admin/orders-timeline`;

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

    static async getAllOrderStatusesDistribution(session){
        const { accessToken } = session ?? {};

        const config = {
            headers: { 
                Authorization: `Bearer ${accessToken}`,
        }
        };
        try {
            return await axios.get(OrderService.ALL_ORDER_STATUSES_DISTRIBUTION, config)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getAllOrdersTimeline(
        session: Session | null, 
        params: OrderTimeLineParams,
    ){
        const { accessToken } = session ?? {};

        const config = {
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                ...params,
            },
        };
        try {
            return await axios.get(OrderService.ALL_ORDERS_TIMELINE, config)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default OrderService
import axios from "axios";
import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;

const productsServices = {
  getAllProducts: async (language = "en") => {
    try {
      const response = await axios.get(`${URL_API}/api/products/all`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  getProductById: async (productId: string, language = "en") => {
    try {
      const response = await axios.get(`${URL_API}/api/products/${productId}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },
  getProductsByCategory: async (category: string, language = "en", page = 1, limit = 16) => {
    try {
      const response = await axios.get(`${URL_API}/api/products`, {
        params: { category, language, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendOrderToBackend: async (orderData: any) => {
    try {
      const response = await axios.post(`${URL_API}/api/order`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error sending order: ", error);
      throw error;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createOrder: async (orderData: any) => {
    try {
      const response = await axios.post(`${URL_API}/api/order/create`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productsServices;

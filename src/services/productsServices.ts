import { ProductsSearchParams } from "@/types/products";
import axios from "axios";
import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;

export default class productsServices {
  static GET_PRODUCTS_ENDPOINT = `${URL_API}/api/products`;

  static GET_ALL_PRODUCTS = `${URL_API}/api/products/all`;

  static GET_ALL_FILTER_OPTIONS = `${URL_API}/api/products/filters`;

  static ORDER_ENDPOINT = `${URL_API}/api/order`;

  static CREATE_ORDER_ENDPOINT = `${URL_API}/api/order/create`;

  static PRODUCT_ENDPOINT = `${URL_API}/api/admin/product`;

  static EDIT_PRODUCT_ENDPOINT = `${URL_API}/api/admin/product`;

  static ADMIN_PRODUCTS_ENDPOINT = `${URL_API}/api/admin/products`;

  static async getAllProducts (language = "en"){
    try {
      const response = await axios.get(productsServices.GET_ALL_PRODUCTS, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProductById (productId: string, language = "en") {
    try {
      const response = await axios.get(`${productsServices.GET_PRODUCTS_ENDPOINT}/${productId}`, {
        params: { 
          language,
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async getProductsByCategory({
    category = "",
    search = "",
    color = "",
    type = "",
    language = "en",
    page = 1,
    limit = 16
  }: ProductsSearchParams){
    try {
      const response = await axios.get(productsServices.GET_PRODUCTS_ENDPOINT, {
        params: {
          category,
          search,
          color,
          type,
          language,
          page,
          limit
        }
      });
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getFilterOptions(){
    try {
      const response = await axios.get(productsServices.GET_ALL_FILTER_OPTIONS);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  }

  static async sendOrderToBackend(orderData) {
    try {
      const response = await axios.post(productsServices.ORDER_ENDPOINT, orderData);
      return response.data;
    } catch (error) {
      console.error("Error sending order: ", error);
      throw error;
    }
  }

  static async createOrder(orderData){
    try {
      const response = await axios.post(productsServices.CREATE_ORDER_ENDPOINT, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order: ", error);
      throw error;
    }
  }

  static async deleteProducts(session, productIds){
    const { accessToken } = session ?? {};

    const config = {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: productIds.join(","),
      },
    };

    try {
      return await axios.delete(productsServices.ADMIN_PRODUCTS_ENDPOINT, config);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async editProduct(session, productData){
    const { accessToken } = session ?? {};
    const { id, ...updateData } = productData;

    const config = {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
      }
    };

    try {
      return await axios.patch(
        `${productsServices.EDIT_PRODUCT_ENDPOINT}/${id}`, 
        updateData, 
      config);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

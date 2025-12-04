import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/products";
import productsServices from "@/services/productsServices";
import { trackViewContent } from "@/lib/fbPixel";
import { pushEcommerceEvent } from "@/Utils/googleUtils";

interface UseProductDataProps {
  productId: string;
  language: string;
}

interface UseProductDataReturn {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export const useProductData = ({ 
  productId, 
  language 
}: UseProductDataProps): UseProductDataReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSentViewItem = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedProduct = await productsServices.getProductById(productId, language);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          const productPrice = fetchedProduct.discount 
            ? Number(fetchedProduct.price) * ((100 - fetchedProduct.discount) / 100) 
            : Number(fetchedProduct.price);

          // Analytics tracking
          if (!hasSentViewItem.current) {
            const item = {
              item_id: fetchedProduct._id,
              item_name: fetchedProduct.name,
              price: productPrice,
              item_category: fetchedProduct.category,
              item_variant: fetchedProduct.model,
            };

            pushEcommerceEvent("view_item", {
              currency: "ILS",
              value: productPrice,
              items: [item]
            });

            hasSentViewItem.current = true;
          }

          trackViewContent(fetchedProduct._id, productPrice);
        } else {
          setError("Failed to fetch product.");
        }
      } catch (error) {
        setError("An error occurred while fetching the product.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, language]);

  return { product, isLoading, error };
};
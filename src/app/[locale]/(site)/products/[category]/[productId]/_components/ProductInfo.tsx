import { FC } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/products";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { trackAddToCart } from "@/lib/fbPixel";
import { createAddToCartEvent, formatPrice } from "@/Utils/productsUtils";

interface ProductInfoProps {
  product: Product;
  productPriceWithDiscount: number;
}

const ProductInfo: FC<ProductInfoProps> = ({ 
  product, 
  productPriceWithDiscount, 
}) => {
  const dispatch = useDispatch();
  const t = useTranslations("Description");

  const handleAddToCart = async () => {
    if (!product) return;

    const quantity = 1;
    const newProduct = { ...product, quantity };

    dispatch(addToCart(newProduct));
    dispatch(setCollapsedСart(false));

    const analyticsEvent = createAddToCartEvent(product, quantity);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(analyticsEvent);

    trackAddToCart(product._id, Number(product.price), quantity);
  };

  const boxPrice = product.boxCoverage 
    ? (productPriceWithDiscount * product.boxCoverage).toFixed(2)
    : null;

  const originalBoxPrice = product.boxCoverage && product.discount
    ? (Number(product.price) * product.boxCoverage).toFixed(2)
    : null;

  return (
    <div className="product bg-white border rounded p-4 space-y-3">
        <h3 className="font-bold text-2xl text-gray-900">{product.name}</h3>

        <div className="space-y-2">
        <div>
            {product.discount ? (
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">
                {formatPrice(productPriceWithDiscount)}
                </span>
                <span className="text-gray-500 line-through">
                {formatPrice(Number(product.price))}
                </span>
                <span className="text-sm text-gray-600">/ {t("price_per_meter")}</span>
            </div>
            ) : (
            <div className="flex items-center gap-1">
                <span className="text-xl font-bold">
                {formatPrice(Number(product.price))}
                </span>
                <span className="text-sm text-gray-600">/ {t("price_per_meter")}</span>
            </div>
            )}
        </div>

        {boxPrice && (
            <div className="text-sm">
            <span className="font-semibold">{formatPrice(Number(boxPrice))}</span>
            <span className="text-gray-600"> {t("per_box")}</span>
            <span className="text-gray-500"> ({product.boxCoverage}м²)</span>
            {originalBoxPrice && (
                <span className="text-gray-400 line-through ml-1">
                {formatPrice(Number(originalBoxPrice))}
                </span>
            )}
            </div>
        )}
        </div>

        <p className="text-xs text-gray-500">{t("product_notice")}</p>
        
        <Button 
            size="lg"
            className={cn(
            "w-full font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0 rounded-md transition-all duration-300",
            )}
            onClick={handleAddToCart}
        >
            {t("button_add_to_cart")}
        </Button>
    </div>
    );
};

export default ProductInfo;
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/products";
import { FC } from "react";

const PriceDisplay: FC<{ product: Product }> = ({ product }) => {
  const productPriceWithDiscount = product.discount 
    ? Number(product.price) * ((100 - product.discount) / 100) 
    : Number(product.price);

  if (product.discount) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-3xl font-bold text-gray-900">
          ₪{productPriceWithDiscount.toFixed(0)}
        </div>
        <div className="flex flex-col">
          <div className="text-lg text-gray-500 line-through">
            ₪{product.price}
          </div>
          <Badge variant="destructive" className="text-xs">
            -{product.discount}%
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="text-3xl font-bold text-gray-900">
      ₪{product.price}
    </div>
  );
};
export default PriceDisplay;
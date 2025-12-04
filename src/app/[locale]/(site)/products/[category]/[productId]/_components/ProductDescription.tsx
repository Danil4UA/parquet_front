import { FC } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/products";

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: FC<ProductDescriptionProps> = ({ product }) => {
  const t = useTranslations("Description");

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  if (!product.detailedDescription) {
    return null;
  }

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white border rounded p-4 space-y-3"
    >
      <h2 className="font-bold text-2xl text-gray-900">
        {t("product_description_title")}
      </h2>
      
      <Separator />
      
      <p className="text-gray-700 leading-relaxed text-base">
        {product.detailedDescription}
      </p>
    </motion.div>
  );
};

export default ProductDescription;
"use client";

import { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Utils from "@/Utils/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductGallery from "./_components/ProductGallery";
import ProductInfo from "./_components/ProductInfo";
import ProductSpecifications from "./_components/ProductSpecifications";
import ProductDescription from "./_components/ProductDescription";
import DeliveryInfo from "./_components/DeliveryInfo";
import RelatedProductsSection from "./_components/RelatedProductsSection";
import ErrorState from "@/components/ErrorState";
import { useProductData } from "@/hooks/useProductDataReturn";
import { calculateDiscountedPrice } from "@/Utils/productsUtils";
import ContactForm from "./_components/ContactForm";

const ProductPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const { productId } = useParams<{ productId: string }>();
  
  const { product, isLoading, error } = useProductData({ 
    productId, 
    language 
  });

  const productPriceWithDiscount = product ? calculateDiscountedPrice(product) : 0;
  const productSchema = product ? Utils.generateProductSchema(product, productPriceWithDiscount) : null;

  if (isLoading) {
    return (
      <section className="bg-gray-50 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return <ErrorState error={error} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

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

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
              
              <ProductGallery images={product.images} />
              
              <div className="w-full lg:w-1/2 space-y-6">
                <ProductInfo 
                  product={product}
                  productPriceWithDiscount={productPriceWithDiscount}
                />
                
                <ProductSpecifications product={product} />
                
                <motion.div variants={itemVariants}>
                  <ContactForm language={language} productId={productId}/>
                </motion.div>

                <ProductDescription product={product} />
                
                <DeliveryInfo router={router} language={language} />
              </div>
            </div>
          </div>
          
          <RelatedProductsSection />
        </motion.section>
      </div>
    </>
  );
};

export default ProductPage;
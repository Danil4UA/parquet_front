"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { useParams, useRouter } from "next/navigation";
import productsServices from "@/services/productsServices";
import Gallery from "@/components/Gallery/Gallery";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Product } from "@/types/products";
import RelatedProductsSection from "./_components/RelatedProductsSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Truck, 
  Clock, 
  Info,
  Palette,
  Ruler,
  Package,
  Star,
  Shield
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { trackAddToCart, trackViewContent } from "@/lib/fbPixel";
import Utils from "@/Utils/utils";
import RouteConstants from "@/constants/RouteConstants";

const ProductPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const isHebrew = language === "he";

  const t = useTranslations("Description");

  const dispatch = useDispatch();
  const { productId } = useParams<{ productId: string }>();

  const productPriceWithDiscount = product?.discount 
    ? Number(product.price) * ((100 - product?.discount) / 100) 
    : Number(product?.price);

  const productSchema = product ? Utils.generateProductSchema(product, productPriceWithDiscount) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await productsServices.getProductById(productId, language);
        if (fetchedProduct) {
          setProduct(fetchedProduct);

          const productPrice = fetchedProduct.discount 
            ? Number(fetchedProduct.price) * ((100 - fetchedProduct.discount) / 100) 
            : Number(fetchedProduct.price);

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

    fetchProduct();
  }, [productId, language]);

  const handleAddToCart = async () => {
    if (!product) return;
    const newProduct = { ...product, quantity: 1 };
    dispatch(addToCart(newProduct));
    dispatch(setCollapsedСart(false));
    trackAddToCart(
      product._id,
      Number(product.price),
      1
    );
  };

  if (isLoading) {
    return (
      <section className=" bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Not found</h2>
          <p className="text-gray-600">{error || "Product not found."}</p>
        </div>
      </section>
    );
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
            
            <motion.div 
              variants={itemVariants}
              className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start"
            >
              <div className="!bg-transparent rounded-2xl">
                <Gallery images={product.images} />
              </div>
            </motion.div>

            <div className="w-full lg:w-1/2 space-y-6">
              
              <motion.div 
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-3 sm:p-4 lg:p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <h1 className={cn(
                    "text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 leading-tight",
                    isHebrew ? "text-right" : "text-left"
                  )}>
                    {product.name}
                  </h1>
                </div>

                <div className={cn("mb-6", isHebrew ? "text-right" : "text-left")}>
                  {product.discount ? (
                    <div className="flex items-center gap-4">
                      <span className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text">
                        ₪{productPriceWithDiscount.toFixed(0)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ₪{product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl lg:text-4xl font-bold text-gray-800">
                      ₪{product.price}
                    </span>
                  )}
                </div>

                <div className="bg-blue-50/80 border border-blue-200/50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {t("product_notice")}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg"
                    className={cn(
                      "w-full h-12 text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300",
                      isHebrew ? "hebrew-text" : "",
                    )}
                    onClick={handleAddToCart}
                  >
                    {t("button_add_to_cart")}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Specifications */}
              <motion.div 
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-3 sm:p-4 lg:p-8"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-gray-600" />
                  {t("specifications_title")}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  {product.model && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_model")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.model}</span>
                    </div>
                  )}
                  
                  {product.length && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_length")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.length} mm</span>
                    </div>
                  )}
                  
                  {product.width && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_width")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.width} mm</span>
                    </div>
                  )}
                  
                  {product.thickness && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_thickness")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.thickness} mm</span>
                    </div>
                  )}
                  
                  {product.color && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_color")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.color}</span>
                    </div>
                  )}
                  
                  {product.boxCoverage && (
                    <div className="bg-gray-50/80 rounded-xl p-2 border border-gray-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-600">
                          {t("specifications_box_coverage")}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{product.boxCoverage} m²</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div 
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-3 sm:p-4 lg:p-8"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                  {t("product_description_title")}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                  {product.detailedDescription}
                </p>
              </motion.div>

              {/* Delivery Info */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-3 sm:p-4 lg:p-8 shadow-xl"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  {t("delivery_title")}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/40 rounded-xl border border-green-300/30">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">{t("delivery_pickup")}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/40 rounded-xl border border-green-300/30">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">{t("delivery_ready_in")}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-green-200/50">
                <p className="text-sm text-gray-600 text-center">
                  {t("see_our")}{" "}
                  <span 
                    className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${language}/${RouteConstants.TERMS_AND_CONDITIONS_PAGE}`)}
                  >
                    {t("terms_and_conditions")}
                  </span>
                </p>
              </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <motion.div variants={itemVariants}>
          <RelatedProductsSection />
        </motion.div>
      </motion.section>
    </div>
    </>
  );
};

export default ProductPage;
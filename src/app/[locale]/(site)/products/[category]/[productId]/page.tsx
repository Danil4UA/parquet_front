"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Utils from "@/Utils/utils";
import ErrorState from "@/components/ErrorState";
import { useProductData } from "@/hooks/useProductDataReturn";
import { calculateDiscountedPrice, createAddToCartEvent } from "@/Utils/productsUtils";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { trackAddToCart } from "@/lib/fbPixel";
import Breadcrumbs from "./_components/Breadcrumbs";
import ProductGallery from "./_components/ProductGallery";
import ProductBuyBox from "./_components/ProductBuyBox";
import ProductSpecifications from "./_components/ProductSpecifications";
import ProductDescription from "./_components/ProductDescription";
import DeliveryInfo from "./_components/DeliveryInfo";
import SimilarProductsRail from "./_components/SimilarProductsRail";
import RelatedProductsSection from "./_components/RelatedProductsSection";
import InstallationSection from "./_components/InstallationSection";
import StickyBuyBar from "./_components/StickyBuyBar";
import RoomVisualizerSheet, { VisualizerStatus } from "./_components/RoomVisualizerSheet";
import ProductPageSkeleton from "./_components/ProductPageSkeleton";
import { isFlooring } from "./_components/productPageUtils";

const ProductPage: FC = () => {
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch();

  const { product, isLoading, error } = useProductData({ productId, language });

  // Callback ref: the observer is (re)attached exactly when the buy button mounts.
  const [ctaNode, setCtaNode] = useState<HTMLDivElement | null>(null);
  const [ctaOutOfView, setCtaOutOfView] = useState(false);
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const [visualizerStatus, setVisualizerStatus] = useState<VisualizerStatus>("idle");

  useEffect(() => {
    if (!ctaNode) return;
    // The root is extended far below the viewport, so the button "intersects" while it is
    // on-screen or below, and stops intersecting only once it scrolls above the top edge.
    // This fires reliably even when a fast scroll jumps straight past the button.
    const observer = new IntersectionObserver(
      ([entry]) => setCtaOutOfView(!entry.isIntersecting),
      { rootMargin: "0px 0px 100000px 0px", threshold: 0 }
    );
    observer.observe(ctaNode);
    return () => observer.disconnect();
  }, [ctaNode]);

  const productPriceWithDiscount = product ? calculateDiscountedPrice(product) : 0;

  const quickAddToCart = useCallback(() => {
    if (!product || product.isAvailable === false) return;
    const quantity = isFlooring(product.category) && product.boxCoverage ? Number(product.boxCoverage) : 1;
    dispatch(addToCart({ ...product, quantity }));
    dispatch(setCollapsedСart(false));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(createAddToCartEvent(product, quantity));
    trackAddToCart(product._id, Number(product.price), quantity);
  }, [dispatch, product]);

  if (isLoading) return <ProductPageSkeleton />;
  if (error || !product) return <ErrorState error={error} />;

  const productSchema = Utils.generateProductSchema(product, productPriceWithDiscount);

  return (
    <>
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}

      <main className="bg-white">
        <div className="mx-auto w-full max-w-7xl lg:px-8 lg:pt-6">
          <div className="px-4 pt-3 pb-3 lg:px-0 lg:pb-5">
            <Breadcrumbs category={product.category} productName={product.name} />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <ProductGallery images={product.images} onVisualize={() => setVisualizerOpen(true)} visualizerStatus={visualizerStatus} />

            <div className="w-full space-y-8 px-4 lg:w-1/2 lg:px-0">
              <ProductBuyBox product={product} productPriceWithDiscount={productPriceWithDiscount} ctaRef={setCtaNode} />
              <ProductSpecifications product={product} />
              <ProductDescription product={product} />
              <DeliveryInfo />
            </div>
          </div>

          <div className="mt-12 space-y-12 px-4 pb-14 lg:px-0 lg:pb-20">
            {isFlooring(product.category) && <SimilarProductsRail product={product} language={language} />}
            <RelatedProductsSection productId={productId} language={language} />
            <InstallationSection language={language} productId={productId} />
          </div>
        </div>
      </main>

      <StickyBuyBar product={product} price={productPriceWithDiscount} visible={ctaOutOfView} onAddToCart={quickAddToCart} />
      <RoomVisualizerSheet product={product} language={language} open={visualizerOpen} onOpenChange={setVisualizerOpen} onStatusChange={setVisualizerStatus} />
    </>
  );
};

export default ProductPage;

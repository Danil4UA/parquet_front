"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageContentTab } from "../edit-product/components/LanguageContentTab";
import { ProductDetailsTab } from "../edit-product/components/ProductDetailsTab";
import { ProductImagesTab } from "../edit-product/components/ProductImagesTab";
import { ProductFormValues, productSchema } from "@/lib/schemas/productSchema";
import productsServices from "@/services/productsServices";
import { useQueryClient } from "@tanstack/react-query";
import { allCategoryProductsKey, allDashboardStatsQueryKey, allProductsByCategoryQueryKey } from "@/constants/queryKey";
import { useRouter, useSearchParams } from "next/navigation";
import RouteConstants from "@/constants/RouteConstants";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AddProductPage() {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cloneId = searchParams.get('clone');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { en: "", ru: "", he: "" },
      detailedDescription: { en: "", ru: "", he: "" },
      category: "",
      color: "",
      countryOfOrigin: "",
      discount: 0,
      finish: "",
      isAvailable: true,
      length: undefined,
      model: "",
      price: undefined,
      stock: 0,
      thickness: undefined,
      type: "",
      width: undefined,
      boxCoverage: undefined,
    },
  });

  useEffect(() => {
    const loadProductToClone = async () => {
      if (cloneId) {
        try {
          setIsLoading(true);
          const session = await getSession();
          const response = await productsServices.getFullProduct(session, cloneId);
          
          if (response?.data?.product) {
            const product = response.data.product;
            
            form.reset({
              name: {
                en: product.name.en || "",
                ru: product.name.ru || "",
                he: product.name.he || "",
              },
              detailedDescription: {
                en: product.detailedDescription.en || "",
                ru: product.detailedDescription.ru || "",
                he: product.detailedDescription.he || "",
              },
              category: product.category || "",
              color: product.color || "",
              countryOfOrigin: product.countryOfOrigin || "",
              discount: product.discount || 0,
              finish: product.finish || "",
              isAvailable: product.isAvailable,
              length: product.length ? Number(product.length) : undefined,
              model: `${product.model || ""}`,
              price: product.price ? Number(product.price) : undefined,
              stock: product.stock || 0,
              thickness: product.thickness ? Number(product.thickness) : undefined,
              type: product.type || "",
              width: product.width ? Number(product.width) : undefined,
              boxCoverage: product.boxCoverage ? Number(product.boxCoverage) : undefined,
            });
          }
        } catch (error) {
          console.error("Error loading product to clone:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProductToClone();
  }, [cloneId, form]);

  async function onSubmit(values: ProductFormValues) {
    if (!productImages || productImages.length === 0) {
      alert("Добавьте хотя бы одно изображение продукта");
      setIsSubmitting(false);
      return;
    }

    const productData = {
      ...values,
      images: productImages
    };

    try {
      setIsSubmitting(true);
      const freshSession = await getSession()
      await productsServices.createProduct(freshSession, productData);

      await queryClient.invalidateQueries({
        queryKey: [allCategoryProductsKey],
      });

      queryClient.invalidateQueries({
        queryKey: [allDashboardStatsQueryKey],
      });

      queryClient.invalidateQueries({
        queryKey: [allProductsByCategoryQueryKey],
      });
      
      router.push(RouteConstants.ADMIN_PRODUCTS);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading product data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
              <TabsTrigger value="he">Hebrew</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en">
              <LanguageContentTab control={form.control} language="en" title="English Content" />
            </TabsContent>
            <TabsContent value="ru">
              <LanguageContentTab control={form.control} language="ru" title="Russian Content" />
            </TabsContent>
            <TabsContent value="he">
              <LanguageContentTab control={form.control} language="he" title="Hebrew Content" />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Product Details</h2>
            <ProductDetailsTab control={form.control} />
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Product Images</h2>
            <ProductImagesTab
              images={productImages}
              onChange={setProductImages}
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset();
                setProductImages([]);
              }}
            >
              Reset Form
            </Button>
            <Button 
              disabled={productImages.length === 0 || isSubmitting}
              type="submit"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
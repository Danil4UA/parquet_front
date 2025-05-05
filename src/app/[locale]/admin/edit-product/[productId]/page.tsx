"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useGetFullSpecificProduct from "@/hooks/useGetFullSpecificProduct";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageContentTab } from "../components/LanguageContentTab";
import { ProductDetailsTab } from "../components/ProductDetailsTab";
import { ProductImagesTab } from "../components/ProductImagesTab";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ProductFormValues, productSchema } from "@/lib/schemas/productSchema";
import productsServices from "@/services/productsServices";
import { useQueryClient } from "@tanstack/react-query";
import { allCategoryProductsKey, fullProductKey } from "@/constants/queryKey";
import { useRouter } from "next/navigation";
import RouteConstants from "@/constants/RouteConstants";

type IEditProduct = {
  params: Promise<{
    productId: string;
  }>;
};

export default function EditProductPage({ params }: IEditProduct) {
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { data: session } = useSession();
  const { productId } = React.use(params);

  const { data, isPending } = useGetFullSpecificProduct(session, productId);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (data?.data?.product && data.data.product.images) {
      setProductImages(data.data.product.images);
      setOriginalImages(data.data.product.images);
    }
  }, [data]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { en: "", ru: "", he: "" },
      // description: { en: "", ru: "", he: "" },
      detailedDescription: { en: "", ru: "", he: "" },
      category: "",
      color: "",
      countryOfOrigin: "",
      discount: 0,
      finish: "",
      isAvailable: true,
      length: null,
      model: "",
      price: undefined,
      stock: 0,
      thickness: null,
      type: "",
      width: null,
      boxCoverage: null,
    },
  });

  useEffect(() => {
    if (data?.data?.product) {
      const product = data.data.product;
      
      form.reset({
        name: {
          en: product.name.en || "",
          ru: product.name.ru || "",
          he: product.name.he || "",
        },
        // description: {
        //   en: product.description.en || "",
        //   ru: product.description.ru || "",
        //   he: product.description.he || "",
        // },
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
        model: product.model || "",
        price: product.price ? Number(product.price) : undefined,
        stock: product.stock || 0,
        thickness: product.thickness ? Number(product.thickness) : undefined,
        type: product.type || "",
        width: product.width  ? Number(product.width) : undefined,
        boxCoverage: product.boxCoverage ? Number(product.boxCoverage) : undefined,
      });

      if (product.images) {
        setProductImages(product.images);
      }
    }
  }, [data, form]);

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true)
    if (!productImages || productImages.length === 0) {
        alert("Добавьте хотя бы одно изображение продукта");
        return;
      }

    const productData = {
        id: productId,
        ...values,
        images: productImages
      };
    try {
        await productsServices.editProduct(session, productData)
        await queryClient.invalidateQueries({
            queryKey: [allCategoryProductsKey],
        })
        await queryClient.invalidateQueries({
            queryKey: [fullProductKey, productId]
        })
        
        router.push(RouteConstants.ADMIN_PRODUCTS)
    } catch (error) {
      console.error("Error updating product:", error);
    }
    setIsSubmitting(false)
  }
  
  if (isPending) {
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
        <h1 className="text-3xl font-bold">Edit Product ({data?.data.product.model})</h1>
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
              images={productImages || []}
              onChange={setProductImages}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => {
                form.reset()
                setProductImages([...originalImages])
            }}>
              Reset Changes
            </Button>
            <Button 
                disabled={ productImages.length === 0 || isSubmitting}
                type="submit"
            >Save Product</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
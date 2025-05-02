// "use client";
// import React, { useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useForm, FormProvider } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { AlertCircle, Save, X } from 'lucide-react';
// import { Switch } from '@/components/ui/switch';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import TextInputWithLabel from '@/components/Inputs/TextInputWithLabel';
// import NumberInputWithLabel from '@/components/Inputs/NumberInputWithLabel';
// import ImageUpload from '../_components/ImageUpload';
// import { LANGUAGES, CATEGORIES, COLORS } from "@/Utils/productsUtils";
// import { ProductFormData, productSchema } from '@/features/products/schemas/addProduct';


// const defaultValues: ProductFormData = {
//   name: { en: '', ru: '', he: '' },
//   description: { en: '', ru: '', he: '' },
//   detailedDescription: { en: '', ru: '', he: '' },
//   price: '',
//   category: '',
//   discount: 0,
//   isAvailable: true,
//   color: '',
//   boxCoverage: '',
//   model: '',
//   type: '',
//   finish: '',
//   width: '',
//   length: '',
//   thickness: '',
//   countryOfOrigin: '',
//   images: []
// };

// export default function AddProductPage() {
//   const [activeTab, setActiveTab] = useState('general');
//   const [languageTab, setLanguageTab] = useState('en');
//   const [uploading, setUploading] = useState(false);
//   const [serverError, setServerError] = useState('');
  
//   const router = useRouter();
//   const pathname = usePathname();
//   const language = pathname.split('/')[1];

//   const methods = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues,
//   });

//   const { handleSubmit, formState, setValue, watch } = methods;
//   const { isSubmitting } = formState;
//   const images = watch('images');

//   const onSubmit = async (data: ProductFormData) => {
//     setServerError('');
    
//     try {
//       console.log("Submitting product data:", data);
//       return
//       router.push(`/${language}/admin/products`);
//     } catch (err) {
//       setServerError(err instanceof Error ? err.message : 'An error occurred while creating the product');
//     }
//   };
  
//   const handleCancel = () => {
//     router.push(`/${language}/admin/products`);
//   };

//   const handleImagesChange = (urls: any[]) => {
//     setValue('images', urls, { shouldValidate: true });
//   };

//   return (
//     <div className="flex flex-col w-full h-full p-4 overflow-auto bg-white">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Add New Product</h1>
//         <div className="flex gap-2">
//           <Button 
//             variant="outline" 
//             onClick={handleCancel} 
//             disabled={isSubmitting}
//             className="flex items-center gap-1"
//           >
//             <X className="w-4 h-4" /> Cancel
//           </Button>
//           <Button 
//             onClick={handleSubmit(onSubmit)} 
//             disabled={isSubmitting} 
//             className="flex items-center gap-1"
//           >
//             {isSubmitting ? "Saving..." : (
//               <>
//                 <Save className="w-4 h-4" /> Save Product
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
      
//       {serverError && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{serverError}</AlertDescription>
//         </Alert>
//       )}
      
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid grid-cols-3 w-full max-w-md">
//               <TabsTrigger value="general">General Info</TabsTrigger>
//               <TabsTrigger value="details">Technical Details</TabsTrigger>
//               <TabsTrigger value="images">Images</TabsTrigger>
//             </TabsList>
            
//             {/* General Information Tab */}
//             <TabsContent value="general" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Language Versions</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs value={languageTab} onValueChange={setLanguageTab}>
//                     <TabsList className="grid grid-cols-3 mb-4">
//                       {LANGUAGES.map(lang => (
//                         <TabsTrigger key={lang.code} value={lang.code}>
//                           {lang.name}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>
                    
//                     {LANGUAGES.map(lang => (
//                       <TabsContent key={lang.code} value={lang.code} className="space-y-4">
//                         <TextInputWithLabel<ProductFormData>
//                           label={`Name (${lang.name}) *`}
//                           nameInSchema={`name.${lang.code}` as any}
//                           placeholder={`Product name in ${lang.name}`}
//                           itemClass="mb-4"
//                         />
                        
//                         <FormField
//                           name={`description.${lang.code}` as any}
//                           render={({ field }) => (
//                             <FormItem className="mb-4">
//                               <FormLabel htmlFor={`description-${lang.code}`}>Short Description ({lang.name}) *</FormLabel>
//                               <FormControl>
//                                 <Textarea 
//                                   id={`description-${lang.code}`}
//                                   placeholder={`Brief product description in ${lang.name}`}
//                                   className="mt-1 h-20"
//                                   {...field}
//                                   value={field.value || ""}
//                                 />
//                               </FormControl>
//                               <FormMessage className="text-red-600" />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           name={`detailedDescription.${lang.code}` as any}
//                           render={({ field }) => (
//                             <FormItem className="mb-4">
//                               <FormLabel htmlFor={`detailedDescription-${lang.code}`}>Detailed Description ({lang.name}) *</FormLabel>
//                               <FormControl>
//                                 <Textarea 
//                                   id={`detailedDescription-${lang.code}`}
//                                   placeholder={`Full product description in ${lang.name}`}
//                                   className="mt-1 h-32"
//                                   {...field}
//                                   value={field.value || ""}
//                                 />
//                               </FormControl>
//                               <FormMessage className="text-red-600" />
//                             </FormItem>
//                           )}
//                         />
//                       </TabsContent>
//                     ))}
//                   </Tabs>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Product Information</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <TextInputWithLabel<ProductFormData>
//                       label="Price *"
//                       nameInSchema="price"
//                       placeholder="Product price"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                     />
                    
//                     <FormField
//                       name="category"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Category *</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="mt-1">
//                                 <SelectValue placeholder="Select category" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {CATEGORIES.map(category => (
//                                 <SelectItem key={category} value={category}>
//                                   {category}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage className="text-red-600" />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       name="color"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Color</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="mt-1">
//                                 <SelectValue placeholder="Select color" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {COLORS.map(color => (
//                                 <SelectItem key={color} value={color}>
//                                   {color}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage className="text-red-600" />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Type"
//                       nameInSchema="type"
//                       placeholder="Product type"
//                     />
                    
//                     <NumberInputWithLabel<ProductFormData>
//                       label="Discount (%)"
//                       nameInSchema="discount"
//                       placeholder="Discount percentage"
//                       min={0}
//                       max={100}
//                     />
                    
//                     <FormField
//                       name="isAvailable"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-6">
//                           <div className="space-y-0.5">
//                             <FormLabel>Available for purchase</FormLabel>
//                           </div>
//                           <FormControl>
//                             <Switch
//                               checked={field.value}
//                               onCheckedChange={field.onChange}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             {/* Technical Details Tab */}
//             <TabsContent value="details" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Technical Specifications</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <TextInputWithLabel<ProductFormData>
//                       label="Model"
//                       nameInSchema="model"
//                       placeholder="Product model"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Finish"
//                       nameInSchema="finish"
//                       placeholder="Surface finish"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Box Coverage (m²)"
//                       nameInSchema="boxCoverage"
//                       placeholder="Area covered by one box"
//                       type="number"
//                       step="0.01"
//                       min="0"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Country of Origin"
//                       nameInSchema="countryOfOrigin"
//                       placeholder="Manufacturing country"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Width (mm)"
//                       nameInSchema="width"
//                       placeholder="Width in millimeters"
//                       type="number"
//                       min="0"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Length (mm)"
//                       nameInSchema="length"
//                       placeholder="Length in millimeters"
//                       type="number"
//                       min="0"
//                     />
                    
//                     <TextInputWithLabel<ProductFormData>
//                       label="Thickness (mm)"
//                       nameInSchema="thickness"
//                       placeholder="Thickness in millimeters"
//                       type="number"
//                       min="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             {/* Images Tab */}
//             <TabsContent value="images" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-center">
//                     <span>Product Images</span>
//                     <span className="text-sm font-normal text-muted-foreground">
//                       {images.length} image(s) selected
//                     </span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <FormField
//                     name="images"
//                     render={() => (
//                       <FormItem>
//                         <FormControl>
                        //   <ImageUpload
//                             value={images}
//                             onChange={handleImagesChange}
//                             onUploadStateChange={setUploading}
//                             uploading={uploading}
//                             maxFiles={5}
//                             accept="image/*"
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-600" />
//                       </FormItem>
//                     )}
//                   />
//                   <p className="text-sm text-muted-foreground mt-2">
//                     Upload up to 5 product images. First image will be used as main product image.
//                   </p>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </form>
//       </FormProvider>
//     </div>
//   );
// }

export default function AddProductPage() {
    return <div>Add Product Page</div>
}
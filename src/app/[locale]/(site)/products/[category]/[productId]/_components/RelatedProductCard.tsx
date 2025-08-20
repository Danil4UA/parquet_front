// import { Product } from "@/types/products";
// import Image from "next/image";
// import { FC, useState } from "react";

// const RelatedProductCard: FC<{ product: Product }> = ({ product }) => {
//   const [imgSrc, setImgSrc] = useState(product.images?.[0] || "/assets/category_flooring.jpg");
//   const [isLoading, setIsLoading] = useState(true);
  
//   const productPriceWithDiscount = product.discount 
//     ? Number(product.price) * ((100 - product.discount) / 100) 
//     : Number(product.price);

//   return (
//     <div className="relative w-full max-w-[250px] bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] group shadow-sm hover:shadow-md mx-auto">
//       <a
//         href={`/products/${product.category}/${product._id}`}
//         className="block overflow-hidden"
//       >
//         <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded-t-lg">
//           {isLoading && (
//             <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
//               <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
//             </div>
//           )}
          
//           <Image
//             fill
//             src={imgSrc}
//             alt={product.name}
//             onError={() => setImgSrc("/assets/category_flooring.jpg")}
//             onLoad={() => setIsLoading(false)}
//             className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
//               isLoading ? "opacity-0" : "opacity-100"
//             }`}
//           />

//           {product.discount && product.discount > 0 && (
//             <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold z-20">
//               -{product.discount}%
//             </div>
//           )}

//           {!product.isAvailable && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
//               <span className="text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded">
//                 Out Of Stock
//               </span>
//             </div>
//           )}

//           {product.isAvailable && (
//             <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
//               <button className="px-3 py-1.5 rounded-md font-medium shadow-lg backdrop-blur-sm transition-colors duration-200 bg-white text-gray-800 hover:bg-gray-100 text-xs">
//                 {/* {t("GetMoreDetails") || "Подробнее"} */}
//                 Get More Details
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="p-2 flex-1 flex flex-col justify-between min-h-[70px]">
//           <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-tight text-center mb-1">
//             {product.name}
//           </h3>

//           <div className="flex items-center justify-center gap-1">
//             {product.discount && product.discount > 0 ? (
//               <>
//                 <span className="text-sm sm:text-base font-bold text-red-600">
//                   ₪{productPriceWithDiscount.toFixed(0)}
//                 </span>
//                 <span className="text-xs text-gray-500 line-through">
//                   ₪{product.price}
//                 </span>
//               </>
//             ) : (
//               <span className="text-sm sm:text-base font-bold text-gray-800">
//                 ₪{product.price}
//               </span>
//             )}
//           </div>
//         </div>
//       </a>
//     </div>
//   );
// };

// export default RelatedProductCard;

import { Product } from "@/types/products";
import Image from "next/image";
import { FC, useState } from "react";

const RelatedProductCard: FC<{ product: Product }> = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || "/assets/category_flooring.jpg");
  const [isLoading, setIsLoading] = useState(true);
  
  const productPriceWithDiscount = product.discount 
    ? Number(product.price) * ((100 - product.discount) / 100) 
    : Number(product.price);

  return (
    <div className="relative w-full max-w-[280px] bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:-translate-y-2 group mx-auto border border-gray-100">
      <a
        href={`/products/${product.category}/${product._id}`}
        className="block overflow-hidden"
      >
        <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-2xl">
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10">
              <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <Image
            fill
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc("/assets/category_flooring.jpg")}
            onLoad={() => setIsLoading(false)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
              -{product.discount}%
            </div>
          )}

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
              <span className="text-white text-sm font-bold bg-gray-900/80 px-4 py-2 rounded-full border border-white/20">
                Out Of Stock
              </span>
            </div>
          )}

          {product.isAvailable && (
            <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
              <button className="px-4 py-2 rounded-full font-semibold shadow-2xl backdrop-blur-md transition-all duration-300 bg-white/95 text-gray-800 hover:bg-white text-sm border border-white/50 transform scale-95 group-hover:scale-100">
                Get More Details
              </button>
            </div>
          )}

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between min-h-[90px] bg-gradient-to-b from-white to-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-relaxed text-center mb-3 group-hover:text-gray-900 transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-2">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  ₪{productPriceWithDiscount.toFixed(0)}
                </span>
                <span className="text-sm text-gray-400 line-through font-medium">
                  ₪{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ₪{product.price}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
};

export default RelatedProductCard;
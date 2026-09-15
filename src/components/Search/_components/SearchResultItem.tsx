import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Product } from "@/types/products";
import { calculateDiscountedPrice, formatPrice } from "@/Utils/productsUtils";

interface SearchResultItemProps {
  product: Product;
  onClose: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ product, onClose }) => {
  const price = calculateDiscountedPrice(product);

  return (
    <Link
      href={`/products/${product.category}/${product._id}`}
      onClick={onClose}
      className="flex gap-3 rounded-xl border border-[#E5E5E5] p-3 transition-colors hover:bg-[#F5F5F4]"
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-[#F5F5F4]">
        {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill sizes="72px" className="object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <p className="line-clamp-2 text-sm font-medium leading-snug text-[#171717]">{product.name}</p>
          {product.model && <p className="mt-0.5 text-xs text-[#6B6B6B]">{product.model}</p>}
        </div>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className={`text-sm font-bold ${product.discount ? "text-[#B3261E]" : "text-[#171717]"}`}>{formatPrice(price)}</span>
          {product.discount ? <span className="text-xs text-[#8A8A8A] line-through">{formatPrice(Number(product.price))}</span> : null}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;

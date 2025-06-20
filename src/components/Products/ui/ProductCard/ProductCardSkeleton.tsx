import React from "react";
import { Skeleton } from '@/components/ui/skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductCard.css";

export default function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[300px] mx-auto bg-white rounded-lg overflow-hidden">
      <div className="relative aspect-square w-full">
        <Skeleton className="absolute inset-0 rounded-lg" />
      </div>
      
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};


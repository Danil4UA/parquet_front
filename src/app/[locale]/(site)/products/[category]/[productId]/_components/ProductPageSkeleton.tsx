import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the loaded page's structure so nothing jumps when data arrives. */
const ProductPageSkeleton = () => (
  <div className="mx-auto w-full max-w-7xl lg:px-8 lg:pt-6">
    {/* Breadcrumbs row: same padding and line height as <Breadcrumbs /> */}
    <div className="flex h-[19.5px] items-center gap-2 px-4 pt-3 pb-3 box-content lg:px-0 lg:pb-5">
      <Skeleton className="h-[13px] w-14" />
      <Skeleton className="h-[13px] w-3" />
      <Skeleton className="h-[13px] w-16" />
      <Skeleton className="h-[13px] w-3" />
      <Skeleton className="h-[13px] w-36" />
    </div>

    <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
      <div className="w-full lg:w-1/2">
        <Skeleton className="aspect-square w-full rounded-none lg:rounded-xl" />
        <div className="mt-3 flex gap-2 px-4 lg:px-1">
          <Skeleton className="size-16 rounded-md" />
          <Skeleton className="size-16 rounded-md" />
        </div>
      </div>

      <div className="w-full space-y-5 px-4 lg:w-1/2 lg:px-0">
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-[188px] w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="size-14 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductPageSkeleton;

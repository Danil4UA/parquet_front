import { cn } from "@/lib/utils";
import React from "react";

type ILoadingSpinner = {
  size?: "small" | "default" | "large" | "xl"
  className?: string
  wrapperClass?: string
}

function LoadingSpinner({
  size = "default",
  className = "",
  wrapperClass = "",
}: ILoadingSpinner) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-6 w-6 border-2",
    large: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };

  return (
    <div className={cn("flex items-center justify-center", wrapperClass)}>
      <div
        className={`
          animate-spin
          rounded-full
          border-primary
          border-t-transparent
          ${sizeClasses[size]}
          ${className}
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;

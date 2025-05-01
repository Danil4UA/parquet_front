"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadsHeaderCellProps {
  text: string;
  className?: string;
}

function ProductsHeaderCell({ text, className = "" }: LeadsHeaderCellProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const checkTruncation = () => {
    if (contentRef.current) {
      setIsTruncated(
        contentRef.current.scrollWidth > contentRef.current.clientWidth,
      );
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      checkTruncation();

      resizeObserverRef.current = new ResizeObserver(checkTruncation);
      resizeObserverRef.current.observe(contentRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    checkTruncation();
  }, [text]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            ref={contentRef}
            className={`truncate w-full ${className}`}
          >
            {text}
          </div>
        </TooltipTrigger>
        {isTruncated && (
          <TooltipContent side="top" align="start" className="max-w-xs">
            <p className="break-words w-full items-center">{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export default ProductsHeaderCell;

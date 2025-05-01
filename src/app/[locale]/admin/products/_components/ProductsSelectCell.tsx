"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import productsServices from "@/services/productsServices";
import { allProductsKey } from "@/constants/queryKey";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDialog from "@/components/ErrorDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";

import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Color, Category, Product } from "@/types/products";

interface ProductsSelectCellProps {
  row: Row<Product>;
  accessorKey: keyof Product;
  options: Color[];
  size: number;
}

function ProductsSelectCell({
  row, accessorKey, options, size,
}: ProductsSelectCellProps) {

  const [value, setValue] = useState(row.original[accessorKey] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setValue(row.original[accessorKey] || "");
  }, [row.original, accessorKey]);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(
        textRef.current.scrollWidth > textRef.current.clientWidth,
      );
    }
  }, [value, row]);

  const handleSelect = async (newValueId: string | null) => {
    if (newValueId === value) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setIsSubmitting(true);
    try {
      const updatedData = {
        [accessorKey]: newValueId,
      };
      const session = await getSession();
      await productsServices.editProduct(session, {
        id: row.original._id,
        ...updatedData,
      });

      await queryClient.invalidateQueries({
        queryKey: [allProductsKey],
      });

      setValue(newValueId || "");
    } catch (err) {
      console.log("err", err);
      setIsErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const getOptionDisplayName = (option: Color | Category) => {
    return option.name;
  };
  
  // Calculate the display value
  const displayValue = value || "Select...";

  return (
    <>
      {isErrorDialogOpen && (
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          onCloseDialog={() => setIsErrorDialogOpen(false)}
          title="Error updating product"
          message="There was a problem updating the product. Please try again."
        />
      )}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          asChild
          disabled={isSubmitting}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center cursor-pointer justify-between">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span ref={textRef} className="truncate max-w-full">
                    {displayValue}
                  </span>
                </TooltipTrigger>
                {isTruncated && (
                  <TooltipContent side="top" align="start" className="max-w-xs">
                    <p className="break-words">{displayValue}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {isSubmitting ? (
              <span className="ml-2">
                <LoadingSpinner />
              </span>
            ) : (
              <ChevronDown className="h-4 w-4 ml-1 flex-shrink-0" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[150px]" style={{ width: `${size || 150}px` }} sideOffset={10} align="end">
          {value && (
          <div
            role="presentation"
            className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 text-gray-500 border-b border-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              if (!isSubmitting) {
                handleSelect(null);
              }
            }}
          >
            Clear selection
          </div>
          )}
          {options.length ? options.map((option: Color | Category) => (
            <div
              key={option.name}
              role="presentation"
              className={`px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                option.name === value ? "bg-gray-100 font-medium" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSubmitting) {
                  handleSelect(option.name);
                }
              }}
            >
              {getOptionDisplayName(option)}
            </div>
          )) : <p className="text-sm text-center">No Options Available</p>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default ProductsSelectCell;
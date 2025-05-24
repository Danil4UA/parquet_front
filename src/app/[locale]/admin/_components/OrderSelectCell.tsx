"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { allOrdersQueryKey } from "@/constants/queryKey";
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
import { Order, StatusOption } from "@/types/orders";
import OrderService from "@/services/orderServices";
import { cn } from "@/lib/utils";

interface OrderSelectCellProps {
  row: Row<Order>;
  accessorKey: Exclude<keyof Order, 'cartItems'>;
  options: StatusOption[];
  size: number;
}

function OrderSelectCell({
  row, accessorKey, options, size,
}: OrderSelectCellProps) {
  const [value, setValue] = useState(row.original[accessorKey] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setValue(row.original[accessorKey] || "");
  }, [row.original, accessorKey]);

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
      await OrderService.editOrder(session, {
        id: row.original._id,
        ...updatedData,
      });

      await queryClient.invalidateQueries({
        queryKey: [allOrdersQueryKey],
      });

      setValue(newValueId || "");
    } catch {
      setIsErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const selectedOption = options.find(option => option.id === value);

  return (
    <>
      {isErrorDialogOpen && (
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          onCloseDialog={() => setIsErrorDialogOpen(false)}
          title="Error updating order"
          message="There was a problem updating the order. Please try again."
        />
      )}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
        asChild
        disabled={isSubmitting}
        onClick={(e) => e.stopPropagation()}
        >
        <div className="w-full relative">
            {selectedOption ? (
            <div 
                className={cn(
                "w-full flex items-center justify-between gap-1 px-3 py-1.5 rounded-md text-xs font-medium border cursor-pointer",
                selectedOption.color || "bg-gray-100 text-gray-800 border-gray-200",
                isSubmitting && "opacity-60"
                )}
            >
                <div className="flex items-center gap-1">
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                {selectedOption.name}
                </div>
                {!isSubmitting && <ChevronDown className="h-3 w-3 flex-shrink-0" />}
                {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                )}
            </div>
            ) : (
            <div className="w-full flex items-center justify-between text-gray-500 text-sm px-3 py-1.5 relative">
                <span className={cn(isSubmitting && "opacity-60")}>-</span>
                {!isSubmitting && <ChevronDown className="h-3 w-3" />}
                {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <LoadingSpinner />
                </div>
                )}
            </div>
            )}
        </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
        className="p-1" 
        style={{ width: `${size || 150}px` }} 
        sideOffset={5} 
        align="end"
        >
        {value && (
            <div
            role="presentation"
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md text-gray-500 mb-1"
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
        
        <div className="px-1">
            {options.length ? options.map((option) => (
            <div
                key={option.id}
                role="presentation"
                className="mb-1 rounded-md cursor-pointer hover:bg-gray-100 p-1 transition-colors"
                onClick={(e) => {
                e.stopPropagation();
                if (!isSubmitting) {
                    handleSelect(option.id);
                }
                }}
            >
                <div 
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all",
                    option.color || "bg-gray-100 text-gray-800",
                    option.id === value && "shadow-sm"
                )}
                >
                {option.icon && <span>{option.icon}</span>}
                <span>{option.name}</span>
                {option.id === value && <span className="ml-auto">✓</span>}
                </div>
            </div>
            )) : (
            <p className="text-sm text-center py-2 text-gray-500">No Options Available</p>
            )}
        </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default OrderSelectCell;
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { allOrdersQueryKey } from "@/constants/queryKey";
import ErrorDialog from "@/components/ErrorDialog";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Order } from "@/types/orders";
import OrderService from "@/services/orderServices";
import Utils from "@/Utils/utils";

interface OrderTextCellProps {
  row: Row<Order>;
  accessorKey: Exclude<keyof Order, 'cartItems'>;
  className?: string
}

function OrderTextCell({ row, accessorKey, className }: OrderTextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<any>(row.original[accessorKey] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setValue(row.original[accessorKey] || "");
  }, [row.original, accessorKey]);

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
  }, [isHovered]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(value.length, value.length);
      }
    }
  }, [isEditing, value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    adjustTextareaHeight();
  };


  const handleSave = async () => {
    if (value === row.original[accessorKey]) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        [accessorKey]: value,
      };
      const session = await getSession();
      await OrderService.editOrder(session,{
        id: row.original._id,
        ...updatedData,
      })

      await queryClient.invalidateQueries({
        queryKey: [allOrdersQueryKey],
      });
    } catch {
      setIsErrorDialogOpen(true);
      setValue(row.original[accessorKey] || "");
    } finally {
      setIsEditing(false);
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div
        className="flex items-center relative w-full p-0 min-h-[24px]"
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          onChange={handleChange}
          className={`absolute z-50 w-full p-2 text-sm bg-white border border-blue-500/20 rounded-md focus:outline-none focus:border-blue-500/50 resize-none overflow-hidden ${className}`}
          style={{
            top: -6,
            left: 0,
            height: "auto",
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
            if (e.key === "Escape") {
              setValue(row.original[accessorKey] || "");
              setIsEditing(false);
            }
          }}
          disabled={isSubmitting}
          autoFocus
        />
      </div>
    );
  }

  return (
    <>
      <ErrorDialog
        isOpen={isErrorDialogOpen}
        onCloseDialog={() => setIsErrorDialogOpen(false)}
        title="Error updating order"
        message="There was a problem updating the order. Please try again."
      />
      <div
        className={`
          cursor-text truncate max-w-full min-h-[24px] ${className}`}
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div
                ref={contentRef}
                className="truncate"
              >
                {accessorKey === "phoneNumber" ? 
                    Utils.formatPhoneNumber(row.original.phoneNumber)
                    : row.original[accessorKey] || ""}
              </div>
            </TooltipTrigger>
            {isTruncated && (
              <TooltipContent side="top" align="start" className="max-w-xs">
                <p className="break-words">{row.original[accessorKey] || ""}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}

export default OrderTextCell;

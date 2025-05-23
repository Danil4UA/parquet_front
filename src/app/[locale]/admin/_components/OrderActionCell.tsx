"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreVertical,} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { allCategoryProductsKey } from "@/constants/queryKey";
import ErrorDialog from "@/components/ErrorDialog";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Order } from "@/types/orders";
import OrderService from "@/services/orderServices";
import ProductsActionSelectOption from "../products/_components/ProductsActionSelectOption";

function OrderActionCell({ row }: {
    row: Row<Order>;
}) {
  const queryClient = useQueryClient();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const session = await getSession();
      await OrderService.deleteOrder(session, row.original._id);
      await queryClient.invalidateQueries({
        queryKey: [allCategoryProductsKey],
      });

    } catch {
      setIsErrorDialogOpen(true);
    } 
    setIsConfirmDeleteDialogOpen(false)
  };

  return (
    <div
      className="flex justify-center items-center w-full"
      role="presentation"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ErrorDialog
        isOpen={isErrorDialogOpen}
        message="Error message"
        onCloseDialog={() => setIsErrorDialogOpen(false)}
        title="There was a problem"
      />
      <ConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        title="Delete Order"
        message={`Are you sure you want to delete the Order?`}
        setIsOpen={setIsConfirmDeleteDialogOpen}
        onConfirmationClick={() => handleDelete()}
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="flex flex-col w-[165px]"
          align="end" 
          sideOffset={5}
        >
            <ProductsActionSelectOption 
                icon={<Trash2 size={16} />} 
                text="Delete" 
                onClick={() => setIsConfirmDeleteDialogOpen(true)} 
            />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OrderActionCell;

"use client";

import { Link } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RouteConstants from "@/constants/RouteConstants";
import {
  Edit, Trash2, Eye, MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import productsServices from "@/services/productsServices";
import { allProductsKey } from "@/constants/queryKey";
import ErrorDialog from "@/components/ErrorDialog";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import { Product } from "@/types/products";
import ProductsActionSelectOption from "./ProductsActionSelectOption";

function ProductsActionCell({ row }: {
    row: Row<Product>;
}) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const session = await getSession();

      await productsServices.deleteProducts([row.original._id], session);
      await queryClient.invalidateQueries({
        queryKey: [allProductsKey],
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.log("error", error)
      setIsErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col w-[165px]">
          <Link href={`${RouteConstants.VIEW_SPECIFIC_PRODUCT}/${row.original._id}`}>
            <ProductsActionSelectOption icon={<Eye size={16} />} text="View" />
          </Link>
          <Link href={`${RouteConstants.EDIT_SPECIFIC_PRODUCT}/${row.original._id}`}>
            <ProductsActionSelectOption icon={<Edit size={16} />} text="Edit" />
          </Link>
          <ProductsActionSelectOption icon={<Trash2 size={16} />} text="Delete" onClick={() => setIsDeleteDialogOpen(true)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProductsActionCell;

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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import productsServices from "@/services/productsServices";
import { allCategoryProductsKey } from "@/constants/queryKey";
import ErrorDialog from "@/components/ErrorDialog";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import { Product } from "@/types/products";
import ProductsActionSelectOption from "./ProductsActionSelectOption";
import ConfirmationDialog from "@/components/ConfirmationDialog";

function ProductsActionCell({ row }: {
    row: Row<Product>;
}) {
  const queryClient = useQueryClient();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const session = await getSession();
      await productsServices.deleteProducts(session, [row.original._id]);
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
        title="Delete Product"
        message={`Are you sure you want to delete the product? name: ${row.original.name} model: ${row.original.model || ""}`}
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
          <Link href={`${RouteConstants.ALL_PRODUCTS_PAGE}/${row.original._id}`}>
            <ProductsActionSelectOption icon={<Eye size={16} />} text="View" />
          </Link>
          <Link href={`${RouteConstants.EDIT_SPECIFIC_PRODUCT}/${row.original._id}`}>
            <ProductsActionSelectOption icon={<Edit size={16} />} text="Edit" />
          </Link>
          <ProductsActionSelectOption icon={<Trash2 size={16} />} text="Delete" onClick={() => setIsConfirmDeleteDialogOpen(true)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProductsActionCell;

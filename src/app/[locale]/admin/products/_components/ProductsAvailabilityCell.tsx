"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import productsServices from "@/services/productsServices";
import { allProductsKey } from "@/constants/queryKey";
import { Product } from "@/types/products";

interface ProductsAvailabilityCellProps {
  row: Row<Product>;
}

function ProductsAvailabilityCell({ row }: ProductsAvailabilityCellProps) {
  const [isAvailable, setIsAvailable] = useState(row.original.isAvailable);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsAvailable(row.original.isAvailable);
  }, [row.original.isAvailable]);

  const handleToggle = async (checked: boolean) => {
    setIsAvailable(checked);
    setIsSubmitting(true);
    try {
      const session = await getSession();
      await productsServices.editProduct(session, {
        id: row.original._id,
        isAvailable: checked,
      });

      await queryClient.invalidateQueries({
        queryKey: [allProductsKey],
      });
    } catch (err) {
      console.error("Error updating availability:", err);
      setIsAvailable(!checked);
      toast.error("Failed to update product availability");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Switch
      checked={isAvailable}
      onCheckedChange={handleToggle}
      disabled={isSubmitting}
      aria-label="In stock"
    />
  );
}

export default ProductsAvailabilityCell;

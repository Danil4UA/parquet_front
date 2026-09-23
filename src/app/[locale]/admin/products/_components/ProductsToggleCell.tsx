"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import productsServices from "@/services/productsServices";
import { allCategoryProductsKey, allProductsKey } from "@/constants/queryKey";
import { Product } from "@/types/products";

type BooleanProductField = "isAvailable" | "hasInteriorPhoto";

interface ProductsToggleCellProps {
  row: Row<Product>;
  // Which boolean product field this switch edits.
  field: BooleanProductField;
  label: string;
}

// Inline on/off switch for a boolean product field. Saves immediately and
// rolls back on failure.
function ProductsToggleCell({ row, field, label }: ProductsToggleCellProps) {
  const [checked, setChecked] = useState(Boolean(row.original[field]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setChecked(Boolean(row.original[field]));
  }, [row.original, field]);

  const handleToggle = async (next: boolean) => {
    setChecked(next);
    setIsSubmitting(true);
    try {
      const session = await getSession();
      await productsServices.editProduct(session, {
        id: row.original._id,
        [field]: next,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [allProductsKey] }),
        queryClient.invalidateQueries({ queryKey: [allCategoryProductsKey] }),
      ]);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      setChecked(!next);
      toast.error(`Failed to update "${label}"`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleToggle}
      disabled={isSubmitting}
      aria-label={label}
    />
  );
}

export default ProductsToggleCell;

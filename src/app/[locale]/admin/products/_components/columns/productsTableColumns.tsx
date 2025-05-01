import { Product } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
import ProductsHeaderCell from "../ProductsHeaderCell";
import ProductsTextCell from "../ProductsTextCell";
import ProductsActionCell from "../ProductsActionCell";
import { categoryOptions, colorOptions } from "@/Utils/productsUtils";
import ProductsSelectCell from "../ProductsSelectCell";
import Image from "next/image";

const createLeadsTableColumns = (): ColumnDef<Product>[] => [
  {
    accessorKey: "image",
    header: () => <ProductsHeaderCell text="Image" className="items-center" />,
    cell: ({ row }) => (
      <Image 
        src={row.original.images[0]} 
        width={28} 
        height={28} 
        alt={row.original.name}
      />
    ),
    size: 40,
    meta: {
      cellClass: "flex justify-center"
    }
  },
  {
    accessorKey: "name",
    header: () => <ProductsHeaderCell text="Name" className="items-center" />,
    cell: ({ row }) => (
      <ProductsTextCell 
        row={row}
        accessorKey="name"
      />
    ),
    size: 150,
  },
  {
    accessorKey: "category",
    header: () => <ProductsHeaderCell text="Category" className="items-center" />,
    cell: ({ row }) => (
      <ProductsSelectCell
        row={row}
        accessorKey="category"
        options={categoryOptions}
        size={150}
      />
    ),
    size: 150,
  },
  {
    accessorKey: "color",
    header: () => <ProductsHeaderCell text="Color" className="items-center" />,
    cell: ({ row }) => (
      <ProductsSelectCell
        row={row}
        accessorKey="color"
        options={colorOptions}
        size={150}
      />
    ),
    minSize: 150,
    size: 150,
  },
  {
    accessorKey: "detailedDescription",
    header: () => <ProductsHeaderCell text="Description" className="items-center" />,
    cell: ({ row }) => (
      <ProductsTextCell 
        row={row}
        accessorKey="detailedDescription"
      />
    ),
    size: 150,
  },
  {
    accessorKey: "price",
    header: () => <ProductsHeaderCell text="Price" className="items-center" />,
    cell: ({ row }) => (
      <ProductsTextCell
        row={row}
        accessorKey="price"
        className="text-center"
      />
    ),
    meta: {
      headerClass: "text-center",
    },
    size: 50,
  },
  {
    accessorKey: "actions",
    header: () => <ProductsHeaderCell text="Actions" className="items-center" />,
    cell: ({ row }) => (
      <ProductsActionCell row={row}/>
    ),
    meta: {
      headerClass: "text-center",
      cellClass: "text-center",
    },
    size: 50,
  }
];

export default createLeadsTableColumns;

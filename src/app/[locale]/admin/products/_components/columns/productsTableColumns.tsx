import { Product } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
import ProductsHeaderCell from "../ProductsHeaderCell";
import ProductsTextCell from "../ProductsTextCell";
import ProductsActionCell from "../ProductsActionCell";
import { 
  allowedTypes, categoryOptions, colorOptions 
} from "@/Utils/productsUtils";
import ProductsSelectCell from "../ProductsSelectCell";
import Image from "next/image";

const createLeadsTableColumns = (): ColumnDef<Product>[] => [
  {
    accessorKey: "image",
    header: () => <ProductsHeaderCell text="" className="items-center" />,
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
        isEditable={false}
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
    accessorKey: "type",
    header: () => <ProductsHeaderCell text="Type" className="items-center" />,
    cell: ({ row }) => (
      <ProductsSelectCell
        row={row}
        accessorKey="type"
        options={allowedTypes}
        size={150}
      />
    ),
    minSize: 150,
    size: 150,
  },
  {
    accessorKey: "model",
    header: () => <ProductsHeaderCell text="Model" className="items-center" />,
    cell: ({ row }) => (
      <ProductsTextCell 
        row={row}
        accessorKey="model"
      />
    ),
    size: 100,
    minSize: 100,
    meta: {
      headerClass: "text-center",
      cellClass: "text-center",
    },
  },
  // {
  //   accessorKey: "boxCoverage",
  //   header: () => <ProductsHeaderCell text="Box Coverage" className="items-center" />,
  //   cell: ({ row }) => (
  //     <ProductsTextCell 
  //       row={row}
  //       accessorKey="boxCoverage"
  //     />
  //   ),
  //   size: 100,
  //   minSize: 100,
  //   meta: {
  //     headerClass: "text-center",
  //     cellClass: "text-center",
  //   },
  // },
  {
    accessorKey: "discount",
    header: () => <ProductsHeaderCell text="Discount(%)" className="items-center" />,
    cell: ({ row }) => (
      <ProductsTextCell 
        row={row}
        accessorKey="discount"
      />
    ),
    size: 100,
    minSize: 100,
    meta: {
      headerClass: "text-center",
      cellClass: "text-center",
    },
  },
  // {
  //   accessorKey: "isAvailable",
  //   header: () => <ProductsHeaderCell text="Available" className="items-center" />,
  //   cell: ({ row }) => (
  //     <ProductsSelectCell
  //       row={row}
  //       accessorKey="isAvailable"
  //       options={availableOptions}
  //       size={150}
  //     />
  //   ),
  //   size: 100,
  //   minSize: 100,
  //   meta: {
  //     headerClass: "text-center",
  //     cellClass: "text-center",
  //   },
  // },
  {
    accessorKey: "price()",
    header: () => <ProductsHeaderCell text="Price(₪)" className="items-center" />,
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
    size: 100,
    minSize: 100,
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
    size: 100,
    minSize: 100,
  }
];

export default createLeadsTableColumns;

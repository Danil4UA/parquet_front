import { Product } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
import ProductsHeaderCell from "../ProductsHeaderCell";
import ProductsTextCell from "../ProductsTextCell";
import ProductsActionCell from "../ProductsActionCell";

const createLeadsTableColumns = (): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: () => <ProductsHeaderCell text="Name" className="items-center" />,
    cell: ({ row }) => (
     <p>{ row.original.name }</p>
    ),
    size: 150,
  },
  {
    accessorKey: "product_category",
    header: () => <ProductsHeaderCell text="Category" className="items-center" />,
    cell: ({ row }) => (
    <p>{ row.original.category }</p>
    ),
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

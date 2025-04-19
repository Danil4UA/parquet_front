import { Product } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";


const createLeadsTableColumns = (
): ColumnDef<Product>[] => [
  {
    id: "select",
    header: () => (
      <div className="w-full flex justify-center">
      </div>
    ),
    cell: () => (
      <p>#</p>
    ),
    size: 50,
    meta: {
      headerClass: "p-0 text-center",
      cellClass: "p-0 text-center",
    },
  },
  {
    accessorKey: "product_name",
    header: () => (
        <div className="w-full flex justify-center">
        </div>
      ),
    cell: ({ row }) => (
    <p>{row.original.name}</p>
    ),
    size: 150,
    minSize: 100,
  },
];

export default createLeadsTableColumns;

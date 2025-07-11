import { Order } from "@/types/orders";
import { ColumnDef } from "@tanstack/react-table";
import ProductsHeaderCell from "../../../products/_components/ProductsHeaderCell";
import OrderTextCell from "../../../_components/OrderTextCell";
import OrderSelectCell from "../../../_components/OrderSelectCell";
import OrdersUtils from "@/Utils/ordersUtils";
import Utils from "@/Utils/utils";
import OrderActionCell from "../../../_components/OrderActionCell";
import CartItemsDialog from "../../../_components/CartItemsDialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const {
  deliveryOptions,
  statusOptions,
  paymentStatusOptions,
} = OrdersUtils;
const createOrdersTableColumns = (): ColumnDef<Order>[] => [
    {
        accessorKey: "name",
        header: () => <ProductsHeaderCell text="Customer" className="items-center" />,
        cell: ({ row }) => (
          <OrderTextCell
            row={row}
            accessorKey="name"
            className=""
          />
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "totalPrice",
        header: () => <ProductsHeaderCell text="Total" className="items-center" />,
        cell: ({ row }) => (
          <p>{row.original.totalPrice !== undefined ? `${row.original.totalPrice} ₪` : ""}</p>        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "deliveryMethod",
        header: () => <ProductsHeaderCell text="Delivery" className="items-center" />,
        cell: ({ row }) => (
          <OrderSelectCell 
            row={row}
            accessorKey="deliveryMethod"
            options={deliveryOptions}
            size={200}
          />
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "status",
        header: () => <ProductsHeaderCell text="Status" className="items-center" />,
        cell: ({ row }) => (
          <OrderSelectCell 
            row={row}
            accessorKey="status"
            options={statusOptions}
            size={200}
          />
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "paymentStatus",
        header: () => <ProductsHeaderCell text="Payment Status" className="items-center" />,
        cell: ({ row }) => (
          <OrderSelectCell 
            row={row}
            accessorKey="paymentStatus"
            options={paymentStatusOptions}
            size={200}
          />
        ),
        size: 150,
        minSize: 150,
    },
     {
        accessorKey: "phoneNumber",
        header: () => <ProductsHeaderCell text="Phone" className="items-center" />,
        cell: ({ row }) => (
          <OrderTextCell
            row={row}
            accessorKey="phoneNumber"
            className=""
          />
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "cartItems",
        header: () => <ProductsHeaderCell text="Items" className="items-center" />,
        cell: ({ row }) => (
         <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">{row.original.cartItems.length}</span>
            <CartItemsDialog
              order={row.original}
              trigger={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                  <Eye className="h-4 w-4 text-blue-600" />
                </Button>
              }
            />
          </div>
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "notes",
        header: () => <ProductsHeaderCell text="Notes" className="items-center" />,
        cell: ({ row }) => (
          <OrderTextCell
            row={row}
            accessorKey="notes"
            className=""
          />
        ),
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "createdAt",
        header: () => <ProductsHeaderCell text="Created At" className="items-center" />,
        cell: ({ row }) => (
          Utils.formatDateString(row.original.createdAt, true)
        ),
        size: 200,
        minSize: 200,
        meta : {
          cellClass: "text-gray-500"
        }
    },
    {
        accessorKey: "actions",
        header: () => <ProductsHeaderCell text="Actions" className="items-center" />,
        cell: ({ row }) => (
          <OrderActionCell 
            row={row}
          />
        ),
        meta: {
          headerClass: "text-center",
          cellClass: "text-center",
        },
        size: 100,
        minSize: 100,
      }
]

export default createOrdersTableColumns
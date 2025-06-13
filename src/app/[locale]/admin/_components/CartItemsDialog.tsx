import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  ShoppingCart,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Calendar,
  Hash,
  User,
  Box,
  Calculator,
  Receipt
} from 'lucide-react';
import { Order, CartItem } from '@/types/orders';

interface CartItemsDialogProps {
  order: Order;
  trigger?: React.ReactNode;
}

const parseName = (nameString: string): string => {
  try {
    const enMatch = nameString.match(/en:\s*'([^']+)'/);
    if (enMatch) return enMatch[1];
    
    return nameString;
  } catch {
    return nameString;
  }
};

const CartItemsDialog: React.FC<CartItemsDialogProps> = ({ order, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'notPaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDeliveryMethod = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'shipping':
        return 'Delivery';
      case 'pickup':
        return 'Pick Up';
      default:
        return method;
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <Package className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Details - {order.orderNumber || order._id}
          </DialogTitle>
          <DialogDescription>
            Complete order information and cart items
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer & Order Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.name} {order.lastName}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Phone className="h-3 w-3" />
                    {order.phoneNumber}
                  </div>
                </div>
                
                {order.address && (
                  <div>
                    <div className="flex items-start gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      <div>
                        <p>{order.address}</p>
                        {order.apartment && <p>Apt: {order.apartment}</p>}
                        {order.city && order.postalCode && (
                          <p>{order.city} {order.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment:</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Delivery:</span>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    <span className="text-sm">{formatDeliveryMethod(order.deliveryMethod)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Cart Items ({order.cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.cartItems.map((item: CartItem, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {parseName(item.name)}
                          </h4>
                          <p className="text-sm text-gray-600">Model: {item.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₪{item.totalPrice?.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calculator className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Qty:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">₪{item.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Box className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Boxes:</span>
                          <span className="font-medium">{item.boxes}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium">{item.actualArea}m²</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Order Summary
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₪{(order.totalPrice - (order.shippingCost || 0))?.toFixed(2)}</span>
                    </div>
                    
                    {order.shippingCost && order.shippingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>₪{order.shippingCost?.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₪{order.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemsDialog;
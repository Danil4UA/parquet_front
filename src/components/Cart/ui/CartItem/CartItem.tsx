"use client";

import { useDispatch, useSelector } from "react-redux";
import { CartItemType, removeFromCart, updateQuantity } from "../../model/slice/cartSlice";
import { RootState } from "@/redux/store";
import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = (props: CartItemProps) => {
  const { name, quantity, images, _id } = props.item;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const item = cartItems.find((cartItem) => cartItem._id === _id);

  // Local state for input
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());

  useEffect(() => {
    setLocalQuantity(quantity.toString());
  }, [quantity]);

  if (!item) {
    return null;
  }

  const productPriceWithDiscount = item.discount 
    ? Number(item.price) * ((100 - Number(item.discount)) / 100) 
    : Number(item.price);

  const totalItemPrice = productPriceWithDiscount * quantity;

  const handleIncrement = () => {
    dispatch(updateQuantity({ productId: item._id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ productId: item._id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalQuantity(value);

    if (value === "") {
      return;
    }

    if (value === "0") {
      dispatch(removeFromCart(item._id));
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      dispatch(updateQuantity({ productId: item._id, quantity: parsedValue }));
    }
  };

  const hasDiscount = item.discount && Number(item.discount) > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image 
            src={images[0]} 
            alt={name} 
            fill
            className="object-cover rounded-md"
            sizes="64px"
          />
          {hasDiscount && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              -{item.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Product Name and Remove Button */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight line-clamp-2 flex-1">
              {name}
            </h3>
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200 group"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500" />
            </button>
          </div>

          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={handleDecrement}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <input
                type="number"
                value={localQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-10 text-center text-sm font-medium bg-transparent border-none outline-none text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              
              <button
                onClick={handleIncrement}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {hasDiscount ? (
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-red-600 dark:text-white">
                    ₪{productPriceWithDiscount.toFixed(0)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400 line-through">
                      ₪{item.price}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-gray-900 dark:text-white">
                    ₪{totalItemPrice.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ₪{item.price} each
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);
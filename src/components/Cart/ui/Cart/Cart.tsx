"use client";

import { memo, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CartItem from "../CartItem/CartItem";
import { selectTotalPrice } from "../../model/slice/cartSlice";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface CartProps {
  collapsed: boolean;
  onClose: () => void;
}

const Cart = ({ collapsed, onClose }: CartProps) => {
  const t = useTranslations("Cart");
  const pathname = usePathname();
  const router = useRouter();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state));
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (!collapsed) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }

    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    };
  }, [collapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/${lng}/order`);
    onClose();
  };

  const cartItemsList = useMemo(() => {
    return cartItems.map((item) => <CartItem key={item._id} item={item} />);
  }, [cartItems]);

  const sidebarVariants = {
    closed: {
      x: isHebrew ? "-100%" : "100%"
    },
    open: {
      x: 0
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0
    },
    open: {
      opacity: 1
    }
  };

  const sidebarTransition = {
    type: "tween" as const,
    duration: 0.3
  };

  const overlayTransition = {
    duration: 0.2
  };

  return (
    <AnimatePresence>
      {!collapsed && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={overlayTransition}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={sidebarTransition}
            className={`fixed top-0 ${
              isHebrew ? "left-0" : "right-0"
            } h-full w-full sm:w-96 lg:w-[420px] bg-white dark:bg-gray-900 shadow-2xl z-[200] flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 dark:bg-gray-700 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("cart")}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cartItems.length} {cartItems.length === 1 ? t("item") : t("items")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("cart_is_empty")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("add_some_products")}
                  </p>
                </div>
              ) : (
                cartItemsList
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {t("total")}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₪{totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={handleComplete}
                    className="w-full group relative px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {t("complete")}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(Cart);
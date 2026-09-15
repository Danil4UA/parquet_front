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
import { formatPrice } from "@/Utils/productsUtils";

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
      html.setAttribute("data-cart-open", "");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      html.removeAttribute("data-cart-open");
    }

    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      html.removeAttribute("data-cart-open");
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
            } h-full w-full sm:w-96 lg:w-[420px] bg-white shadow-2xl z-[200] flex flex-col`}
          >
            {/* Header: same height as the navbar */}
            <div className="flex h-[var(--navbar-height)] shrink-0 items-center justify-between border-b border-[#E5E5E5] px-4 sm:px-5">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-semibold text-[#171717]">{t("cart")}</h2>
                <span className="text-sm text-[#6B6B6B] tabular-nums">
                  {cartItems.length} {cartItems.length === 1 ? t("item") : t("items")}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F5F5F4] hover:text-[#171717]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#F5F5F4]">
                    <ShoppingBag className="size-7 text-[#6B6B6B]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-[#171717]">{t("cart_is_empty")}</h3>
                  <p className="text-sm text-[#6B6B6B]">{t("add_some_products")}</p>
                </div>
              ) : (
                cartItemsList
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="shrink-0 border-t border-[#E5E5E5] p-4 sm:p-5" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}>
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-base font-medium text-[#171717]">{t("total")}</span>
                  <span className="text-2xl font-bold tabular-nums text-[#171717]">{formatPrice(totalPrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#2A2A2A] active:scale-[0.99]"
                >
                  {t("complete")}
                  <ArrowRight className="size-5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(Cart);
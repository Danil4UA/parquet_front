"use client";
import { classNames } from "@/shared/lib/classNames/classNames";
import "./Cart.css";
import { memo, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CartItem from "../CartItem/CartItem";
import { selectTotalPrice } from "../../model/slice/cartSlice";
import CloseIcon from "@/app/assets/close.svg";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface CartProps {
  collapsed: boolean;
  onClose: () => void;
}

const Cart = ({ collapsed, onClose }: CartProps) => {
  const t = useTranslations("Cart");
  const pathname = usePathname();
  const router = useRouter();
  const lng = pathname.split("/")[1];

  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state));
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (!collapsed) {
      html.classList.add("no-scroll");
      body.classList.add("no-scroll");
    } else {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    }
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
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/${lng}/order`);
    onClose();
  };
  const cartItemsList = useMemo(() => {
    return cartItems.map((item) => <CartItem key={item._id} item={item} />);
  }, [cartItems]);

  const isRTL = lng === "he";
  return (
    <>
      <div
        className={classNames(
          "Cart",
          {
            collapsedCart: collapsed,
            "Cart-rtl": isRTL
          },
          []
        )}
      >
        {!collapsed && (
          <div className="Cart_wrapper">
            <div className="Cart_header">
              <p>{t("cart")}</p>
              <button onClick={() => onClose()} className="close-icon">
                <CloseIcon />
              </button>
            </div>
            <div className="Cart_main">{cartItemsList}</div>
            <div className="Cart_footer">
              <div className="Cart_footer_total">
                <span>{t("total")}</span>
                <span>₪ {totalPrice}</span>
              </div>
              <div className="complete_btn_container">
                <button className="complete_btn" onClick={handleComplete}>
                  {t("complete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={classNames("overlayCart", { overlayCartActive: !collapsed }, [])} onClick={() => onClose()}></div>
    </>
  );
};

export default memo(Cart);

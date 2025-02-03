"use client";
import Cart from "../Cart/ui/Cart/Cart";
import Sidebar from "../Sidebar/Sidebar";
import "./Navbar.css";
import { useEffect, useState } from "react";
import MenuIcon from "@/app/assets/hamburger-menu.svg";
import CartIcon from "@/app/assets/cart.svg";
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectTotalItems } from "../Cart/model/slice/cartSlice";
import { Link } from "@/i18n/routing";

const useScrollDirection = () => {
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > document.querySelector(".Navbar")!.clientHeight) {
        document.body.classList.add("scrolled");

        if (currentScrollY < lastScrollY) {
          document.body.classList.add("scroll-up");
          document.body.classList.remove("scrolled");
        } else {
          document.body.classList.remove("scroll-up");
        }
      } else {
        document.body.classList.remove("scrolled", "scroll-up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
};
export const Navbar = () => {
  const [collapsedCart, setCollapsedCart] = useState(true);
  const [collapsedSidebar, setCollapsedSidebar] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _scrollDirection = useScrollDirection();

  const cartItems = useSelector((state: RootState) => selectTotalItems(state));

  const onToggle = () => {
    setCollapsedCart((prev) => !prev);
  };

  const onToggleMenu = () => {
    setCollapsedSidebar((prev) => !prev);
  };

  return (
    <div className="Navbar">
      <div className="navbar-left">
        <span className="navbar_menu" onClick={onToggleMenu}>
          <MenuIcon />
        </span>
        <LangSwitcher />
      </div>

      <div>
        <Link href="/">LOGO</Link>
      </div>
      <div className="navbar-right">
        <div className="navbar_cart" onClick={() => onToggle()}>
          <CartIcon />
          <span className="navbar_cart_coutner">{cartItems > 0 && cartItems}</span>
        </div>
      </div>
      <Cart collapsed={collapsedCart} onClose={() => setCollapsedCart(true)} />
      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)}></Sidebar>
    </div>
  );
};

export default Navbar;

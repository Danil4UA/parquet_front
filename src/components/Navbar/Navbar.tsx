"use client";
import Sidebar from "../Sidebar/Sidebar";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { Menu, Search as SearchIcon, ShoppingCart } from "lucide-react";
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { selectTotalItems, setCollapsedСart } from "../Cart/model/slice/cartSlice";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import logoPhoto from "@/app/assets/logo_photo.png";
import Search from "../Search/Search";

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
  const [collapsedSidebar, setCollapsedSidebar] = useState(true);
  const [openSearch, setOpenSearch] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _scrollDirection = useScrollDirection();
  const dispatch = useDispatch();
  const collapsedCart = useSelector((state: RootState) => state.cart.isCollapsedCart);
  const cartItems = useSelector((state: RootState) => selectTotalItems(state));

  const onToggleCart = () => {
    dispatch(setCollapsedСart(!collapsedCart));
  };

  const onToggleMenu = () => {
    setCollapsedSidebar((prev) => !prev);
  };

  return (
    <div className="Navbar">
      <div className="navbar-left">
        <span className="navbar_menu" onClick={onToggleMenu}>
          <Menu size={32} />
        </span>
        <span className="language-container">
          <LangSwitcher />
        </span>
      </div>
    
      <div className="navbar-logo">
        <Link href="/">
          <Image src={logoPhoto} alt="logo" width={48} height={48} />
        </Link>
      </div>
      <div className="navbar-right">
        <div className="navbar_search" onClick={() => setOpenSearch((prev) => !prev)}>
          <SearchIcon size={32} />
        </div>
        <div className="navbar_cart" onClick={() => onToggleCart()}>
          <ShoppingCart size={32} />
          <span className="navbar_cart_counter">{cartItems > 0 && cartItems}</span>
        </div>
      </div>
      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)} />
      {openSearch && <Search onClose={() => setOpenSearch(false)} />}
  </div>
  );
};

export default Navbar;
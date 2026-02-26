"use client";

import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useRef, useState } from "react";
import { Menu, Search as SearchIcon, ShoppingCart } from "lucide-react";
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { selectTotalItems, setCollapsedСart } from "../Cart/model/slice/cartSlice";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import logoPhoto from "@/app/assets/logo_photo.png";
import Search from "../Search/Search";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { setNavbarVisible } from "./model/navbarSlice";
import "./Navbar.css";

const useScrollDirection = () => {
  const lastScrollY = useRef(0);
  const { isMobile } = useIsMobileDebounce();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMobile) {
      document.body.classList.remove("scrolled", "scroll-up");
      dispatch(setNavbarVisible(true));
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const navbarElement = document.querySelector(".Navbar");

      if (!navbarElement) return;
      if (Math.abs(currentScrollY - lastScrollY.current) < 2) return;

      if (currentScrollY > navbarElement.clientHeight) {
        document.body.classList.add("scrolled");

        if (currentScrollY < lastScrollY.current) {
          document.body.classList.add("scroll-up");
          document.body.classList.remove("scrolled");
          dispatch(setNavbarVisible(true));
        } else {
          document.body.classList.remove("scroll-up");
          dispatch(setNavbarVisible(false));
        }
      } else {
        document.body.classList.remove("scrolled", "scroll-up");
        dispatch(setNavbarVisible(true));
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, dispatch]);
};

export const Navbar = () => {
  const [collapsedSidebar, setCollapsedSidebar] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _scrollDirection = useScrollDirection();
  const dispatch = useDispatch();
  const collapsedCart = useSelector((state: RootState) => state.cart.isCollapsedCart);
  const cartItems = useSelector((state: RootState) => selectTotalItems(state));

  const onToggleCart = () => {
    dispatch(setCollapsedСart(!collapsedCart));
  };

  return (
    <div className="Navbar fixed top-0 left-0 w-full h-[var(--navbar-height)] bg-[#171717] flex items-center justify-between px-4 sm:px-8 lg:px-16 text-white transition-transform duration-300 ease-in-out z-[100]">
      <div className="flex items-center gap-5 z-10">
        <button
          className="flex items-center justify-center w-9 h-9 text-white cursor-pointer"
          onClick={() => setCollapsedSidebar(prev => !prev)}
        >
          <Menu size={32} />
        </button>
        <LangSwitcher />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link href="/">
          <Image src={logoPhoto} alt="logo" width={48} height={48} />
        </Link>
      </div>

      <div className="flex items-center gap-5 z-10">
        <button
          className="flex items-center justify-center w-9 h-9 text-white cursor-pointer"
          onClick={() => setOpenSearch(prev => !prev)}
        >
          <SearchIcon size={32} />
        </button>
        <button
          className="relative flex items-center justify-center w-9 h-9 text-white cursor-pointer"
          onClick={onToggleCart}
        >
          <ShoppingCart size={32} />
          {cartItems > 0 && (
            <span className="absolute -top-1 -right-2.5 bg-red-500 text-white text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center px-1">
              {cartItems}
            </span>
          )}
        </button>
      </div>

      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)} />
      {openSearch && <Search onClose={() => setOpenSearch(false)} />}
    </div>
  );
};

export default Navbar;

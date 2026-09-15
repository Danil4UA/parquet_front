"use client";

import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useRef, useState } from "react";
import { Menu, Search as SearchIcon, ShoppingCart, Heart } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { selectTotalItems, setCollapsedСart } from "../Cart/model/slice/cartSlice";
import { selectTotalFavorites } from "../Favorites/model/slice/favoritesSlice";
import RouteConstants from "@/constants/RouteConstants";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import logoPhoto from "@/app/logo_transparent.png";
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
  const t = useTranslations("HomePage");
  const tSidebar = useTranslations("Sidebar");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _scrollDirection = useScrollDirection();
  const dispatch = useDispatch();
  const collapsedCart = useSelector((state: RootState) => state.cart.isCollapsedCart);
  const cartItems = useSelector((state: RootState) => selectTotalItems(state));
  const favoritesCount = useSelector((state: RootState) => selectTotalFavorites(state));

  const onToggleCart = () => {
    dispatch(setCollapsedСart(!collapsedCart));
  };

  const categoryLinks = [
    { key: "catalog", href: "/products/all" },
    { key: "laminate", href: "/products/laminate" },
    { key: "spc", href: "/products/spc" },
    { key: "wood", href: "/products/wood" },
    { key: "panels", href: "/products/panels", className: "hidden xl:inline-flex" },
  ];

  return (
    <div className="Navbar fixed top-0 left-0 z-[100] flex h-[var(--navbar-height)] w-full items-center justify-between bg-[#171717] px-1 text-white transition-transform duration-300 ease-in-out sm:px-4 lg:px-8">
      <div className="z-10 flex items-center gap-1 lg:gap-2">
        <button
          type="button"
          aria-label={tSidebar("menu")}
          className="flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          onClick={() => setCollapsedSidebar(prev => !prev)}
        >
          <Menu className="size-6" strokeWidth={1.75} />
        </button>
        <div className="lg:hidden">
          <LangSwitcher compact />
        </div>
        <nav aria-label="Categories" className="hidden items-center gap-1 lg:flex">
          {categoryLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`${link.className ?? "inline-flex"} h-10 items-center rounded-lg px-3 text-[15px] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white`}
            >
              {tSidebar(link.key)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="flex flex-col items-center" aria-label={t("effect_parquet")}>
          <Image src={logoPhoto} alt="" width={40} height={40} className="size-8 md:size-10" priority />
          <span className="-mt-0.5 whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.18em] text-white md:text-[11px] md:tracking-[0.25em]">
            {t("effect_parquet")}
          </span>
        </Link>
      </div>

      <div className="z-10 flex items-center gap-0 lg:gap-1">
        <div className="hidden lg:block">
          <LangSwitcher />
        </div>
        <button
          type="button"
          aria-label="Search"
          className="flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          onClick={() => setOpenSearch(prev => !prev)}
        >
          <SearchIcon className="size-6" strokeWidth={1.75} />
        </button>
        <Link
          href={RouteConstants.FAVORITES_PAGE}
          className="relative flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          aria-label="Favorites"
        >
          <Heart className="size-6" strokeWidth={1.75} />
          {favoritesCount > 0 && (
            <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E5484D] px-1 text-[10px] font-semibold tabular-nums text-white">
              {favoritesCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          aria-label="Cart"
          className="relative flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          onClick={onToggleCart}
        >
          <ShoppingCart className="size-6" strokeWidth={1.75} />
          {cartItems > 0 && (
            <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E5484D] px-1 text-[10px] font-semibold tabular-nums text-white">
              {cartItems}
            </span>
          )}
        </button>
      </div>

      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)} />
      <AnimatePresence>{openSearch && <Search key="search" onClose={() => setOpenSearch(false)} />}</AnimatePresence>
    </div>
  );
};

export default Navbar;

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
import Search from "../Search/Search";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { setNavbarVisible } from "./model/navbarSlice";
import "./Navbar.css";

// On phones the bar slides away while scrolling down and comes back on the first scroll up.
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

const iconButton =
  "relative flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:size-10";
const badge =
  "absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold tabular-nums text-[#171717]";

/** Black bar: menu and language on the start side, wordmark in the middle, search / favorites / cart on the end side. */
export const Navbar = () => {
  const [collapsedSidebar, setCollapsedSidebar] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const t = useTranslations("HomePage");
  const tSidebar = useTranslations("Sidebar");

  useScrollDirection();
  const dispatch = useDispatch();
  const collapsedCart = useSelector((state: RootState) => state.cart.isCollapsedCart);
  const cartItems = useSelector((state: RootState) => selectTotalItems(state));
  const favoritesCount = useSelector((state: RootState) => selectTotalFavorites(state));

  const onToggleCart = () => {
    dispatch(setCollapsedСart(!collapsedCart));
  };

  const links = [
    { key: "catalog", href: "/products/all" },
    { key: "wood", href: "/products/wood" },
    { key: "laminate", href: "/products/laminate" },
    { key: "spc", href: "/products/spc" },
    { key: "panels", href: "/products/panels", className: "hidden xl:inline-flex" },
    { key: "contactUs", href: RouteConstants.CONTACT_US_PAGE },
  ];

  return (
    <div className="Navbar fixed left-0 top-0 z-[100] h-[var(--navbar-height)] w-full border-b border-white/10 bg-[#171717] transition-transform duration-300 ease-in-out">
      {/* Full width on every screen: the bar never jumps between pages of different content widths. */}
      <div className="flex h-full w-full items-center justify-between px-1.5 sm:px-5">
        <div className="z-10 flex items-center -space-x-1 sm:space-x-0 sm:gap-0.5">
          <button type="button" aria-label={tSidebar("menu")} className={`${iconButton} lg:hidden`} onClick={() => setCollapsedSidebar((prev) => !prev)}>
            <Menu className="size-[22px]" strokeWidth={1.75} />
          </button>
          <div className="lg:hidden">
            <LangSwitcher compact tone="light" />
          </div>
          <Link href="/" className="me-5 hidden whitespace-nowrap text-base font-semibold uppercase tracking-[.1em] text-white lg:inline-flex" aria-label={t("effect_parquet")}>
            {t("effect_parquet")}
          </Link>
          <nav aria-label="Categories" className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`${link.className ?? "inline-flex"} h-9 items-center rounded-full px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white`}
              >
                {tSidebar(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[.08em] text-white min-[400px]:text-[15px] sm:text-base sm:tracking-[.1em] lg:hidden"
          aria-label={t("effect_parquet")}
        >
          {t("effect_parquet")}
        </Link>

        <div className="z-10 flex items-center -space-x-1 sm:space-x-0 sm:gap-0.5">
          <div className="hidden lg:block">
            <LangSwitcher tone="light" />
          </div>
          <button type="button" aria-label="Search" className={iconButton} onClick={() => setOpenSearch((prev) => !prev)}>
            <SearchIcon className="size-[22px]" strokeWidth={1.75} />
          </button>
          <Link href={RouteConstants.FAVORITES_PAGE} className={iconButton} aria-label="Favorites">
            <Heart className="size-[22px]" strokeWidth={1.75} />
            {favoritesCount > 0 && <span className={badge}>{favoritesCount}</span>}
          </Link>
          <button type="button" aria-label="Cart" className={iconButton} onClick={onToggleCart}>
            <ShoppingCart className="size-[22px]" strokeWidth={1.75} />
            {cartItems > 0 && <span className={badge}>{cartItems}</span>}
          </button>
        </div>
      </div>

      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)} />
      <AnimatePresence>{openSearch && <Search key="search" onClose={() => setOpenSearch(false)} />}</AnimatePresence>
    </div>
  );
};

export default Navbar;

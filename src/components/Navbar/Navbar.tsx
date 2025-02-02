"use client";
import Cart from "../Cart/ui/Cart/Cart";
import Sidebar from "../Sidebar/Sidebar";
import "./Navbar.css";
import { useState } from "react";
import MenuIcon from "@/app/assets/hamburger-menu.svg";
import CartIcon from "@/app/assets/cart.svg"
// import SearchIcon from "@/app/assets/search.svg"
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectTotalItems } from "../Cart/model/slice/cartSlice";

export const Navbar = () => {
  const [collapsedCart, setCollapsedCart] = useState(true)
  const [collapsedSidebar, setCollapsedSidebar] = useState(true);
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
        <span 
          className="navbar_menu"
          onClick={onToggleMenu}>
          <MenuIcon />
        </span>
        <LangSwitcher />
      </div>

      <div>LOGO</div>
      <div className="navbar-right">
        <div 
          className="navbar_cart"
          onClick={() => onToggle()}
          >
          <CartIcon />
          <span 
            className="navbar_cart_coutner"
          >{cartItems > 0 && cartItems}</span>
          
          </div>

        {/* <span
          className="navbar_search"
        >
          <SearchIcon />
        </span> */}
      </div>

      <Cart collapsed={collapsedCart} onClose={()=>setCollapsedCart(true)} />
      <Sidebar collapsed={collapsedSidebar} onClose={() => setCollapsedSidebar(true)}></Sidebar>
    </div>
  );
};

export default Navbar;

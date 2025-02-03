"use client";
import "./Sidebar.css";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useEffect, useMemo } from "react";
import { SidebarItemsList } from "./model/items";
import SidebarItem from "./SideBarItem/SideBarItem";
import InstagramIcon from "@/app/assets/instagram.svg";
import FacebookIcon from "@/app/assets/facebook.svg";
import TelegramIcon from "@/app/assets/telegram.svg";
import { usePathname } from "next/navigation";
// import CloseIcon from "@/app/assets/close.svg";

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

export const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];

  useEffect(() => {
    if (!collapsed) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
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

  const itemsList = useMemo(() => {
    return SidebarItemsList.map((item) => <SidebarItem item={item} collapsed={collapsed} onClose={onClose} key={item.path} />);
  }, [collapsed, onClose]);
  const isRTL = lng === "he";
  return (
    <>
      {/* Sidebar */}
      <div className={classNames("Sidebar", { ["collapsed"]: collapsed, "Sidebar-rtl": isRTL }, [])}>
        {!collapsed && (
          <div>
            {/* <div className="Sidebar_header">
              <button onClick={() => onClose()} className="Sidebar-close-icon">
                <CloseIcon />
              </button>
            </div> */}
            <div className="Sidebar_wrapper">
              <div className="items">
                <div className="items_header"></div>
                {itemsList}
              </div>
              <div className="Sidebar_footer">
                <div className="Sidebar_footer_contact">
                  <div>
                    <span>
                      <InstagramIcon />
                    </span>
                    <span>
                      <FacebookIcon />
                    </span>
                    <span>
                      <TelegramIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay */}
      <div className={classNames("overlay", { overlayActive: !collapsed })} onClick={onClose} />
    </>
  );
};

export default Sidebar;

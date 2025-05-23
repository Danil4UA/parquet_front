"use client";
import "./Sidebar.css";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useEffect, useMemo } from "react";
import { SidebarItemsList } from "./model/items";
import SidebarItem from "./SideBarItem/SideBarItem";
import InstagramIcon from "@/app/assets/instagram.svg";
import FacebookIcon from "@/app/assets/facebook.svg";
import { usePathname } from "next/navigation";
import LangSwitcher from "@/widgets/LangSwitcher/ui/LangSwitcher";
import { socialLinks } from "@/Utils/utils";
import { Link } from "@/i18n/routing";

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
      <div className={classNames("Sidebar", { ["collapsed"]: collapsed, ["Sidebar-rtl"]: isRTL }, [])}>
        {!collapsed && (
          <div>
            <div className="Sidebar_wrapper">
              <div className="items">
                <div className="items_header">
                  <LangSwitcher />
                </div>
                {itemsList}
              </div>
              <div className="Sidebar_footer">
                <div className="Sidebar_footer_contact">
                  <div>
                    <span>
                      <Link href={socialLinks.instagram}>
                        <InstagramIcon />
                      </Link>
                    </span>
                    <span>
                      <Link href={socialLinks.facebook}>
                        <FacebookIcon />
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={classNames("overlay", { overlayActive: !collapsed })} onClick={onClose} />
    </>
  );
};

export default Sidebar;

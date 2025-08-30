"use client";
import "./Sidebar.css";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useEffect, useMemo } from "react";
import { SidebarItemsList } from "./model/items";
import SidebarItem from "./SideBarItem/SideBarItem";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/Utils/utils";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Facebook } from "lucide-react";
import { useTranslations } from "next-intl";

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

export const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (!collapsed) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }

    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
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
    return SidebarItemsList.map((item) => (
      <SidebarItem 
        item={item} 
        collapsed={collapsed} 
        onClose={onClose} 
        key={item.path} 
      />
    ));
  }, [collapsed, onClose]);

  const sidebarVariants = {
    closed: {
      x: isHebrew ? "100%" : "-100%"
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
    duration: 0.3,
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

          {/* Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={sidebarTransition}
            className={classNames(
              "fixed top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-[200] flex flex-col",
              { 
                "left-0": !isHebrew, 
                "right-0": isHebrew 
              }
            )}
            style={{ width: "min(100vw, 380px)" }}
          >
            {/* Modern Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 h-[70px]">
              <div className="flex items-center gap-3">
                {/* <div className="p-2 bg-gray-700 rounded-lg">
                  <Menu className="w-5 h-5 text-white" />
                </div> */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("menu")}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("navigation")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Navigation Items */}
              <div className="p-2 sm:p-4 space-y-2">
                {itemsList}
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="space-y-4">
                {/* Social Links */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t("follow_us")}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Link 
                      href={socialLinks.instagram}
                      className="group relative p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Instagram className="w-5 h-5 text-white relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-red-600 to-yellow-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    <Link 
                      href={socialLinks.facebook}
                      className="group p-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
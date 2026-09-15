"use client";
import { useEffect, useMemo } from "react";
import { SidebarItemsList } from "./model/items";
import SidebarItem from "./SideBarItem/SideBarItem";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/Utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import useSalesAvailable from "@/hooks/useSalesAvailable";

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

export const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const { salesAvailable } = useSalesAvailable(lng);

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
    return SidebarItemsList
      .filter((item) => salesAvailable || item.path !== "/products/sales")
      .map((item) => (
        <SidebarItem
          item={item}
          collapsed={collapsed}
          onClose={onClose}
          key={item.path}
        />
      ));
  }, [collapsed, onClose, salesAvailable]);

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
            className="fixed inset-0 min-h-screen bg-black/60 backdrop-blur-sm z-[150]"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={sidebarTransition}
            className={cn(
              "fixed top-0 h-[100dvh] bg-white dark:bg-gray-900 shadow-2xl z-[200] flex flex-col",
              isHebrew ? "right-0" : "left-0",
            )}
            style={{ width: "min(100vw, 380px)" }}
          >
            {/* Modern Header */}
            <div className="flex h-[var(--navbar-height)] items-center justify-between border-b border-[#E5E5E5] px-3 sm:px-5">
              <h2 className="text-lg font-semibold text-[#171717]">{t("menu")}</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex size-11 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F5F5F4] hover:text-[#171717]"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Navigation Items */}
              <div className="p-2 sm:p-4 space-y-2">
                {itemsList}
              </div>
            </div>

            {/* Footer: contacts */}
            <div className="border-t border-[#E5E5E5] px-4 py-4 sm:px-6">
              <h3 className="mb-3 text-sm font-medium text-[#6B6B6B]">{t("follow_us")}</h3>
              <div className="flex items-center gap-2">
                {[
                  { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
                  { icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
                  { icon: MessageCircle, href: socialLinks.whatsapp, label: "WhatsApp" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex size-10 items-center justify-center rounded-full border border-[#DCDCDB] text-[#4B4B4B] transition-colors hover:border-[#171717] hover:text-[#171717]"
                    >
                      <Icon className="size-[18px]" strokeWidth={1.75} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
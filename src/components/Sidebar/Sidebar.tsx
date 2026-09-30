"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Instagram, Facebook, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { contactData, socialLinks } from "@/Utils/utils";
import useSalesAvailable from "@/hooks/useSalesAvailable";
import { SidebarItemsList, SidebarItemType } from "./model/items";

interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
}

const isProductLink = (item: SidebarItemType) => item.path.startsWith("/products/");

/** Menu drawer: home, the catalog and the company pages as plain rows, the ways to reach the shop at the bottom. */
export const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const t = useTranslations("Sidebar");
  const tHome = useTranslations("HomePage");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const pathWithoutLang = pathname.replace(`/${lng}`, "") || "/";
  const { salesAvailable } = useSalesAvailable(lng);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (!collapsed) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
      html.setAttribute("data-menu-open", "");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      html.removeAttribute("data-menu-open");
    }

    return () => {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      html.removeAttribute("data-menu-open");
    };
  }, [collapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isActive = (item: SidebarItemType) =>
    item.path === "/" || item.exactMatch ? pathWithoutLang === item.path : pathWithoutLang.includes(item.path);

  // Home first, then the catalog, then the company pages.
  const groups = [
    SidebarItemsList.filter((item) => item.path === "/"),
    SidebarItemsList.filter((item) => isProductLink(item) && (salesAvailable || item.path !== "/products/sales")),
    SidebarItemsList.filter((item) => item.path !== "/" && !isProductLink(item)),
  ];

  return (
    <AnimatePresence>
      {!collapsed && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[150] min-h-screen bg-black/50"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            initial={{ x: isHebrew ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isHebrew ? "100%" : "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={cn("fixed top-0 z-[200] flex h-[100dvh] w-[min(100vw,400px)] flex-col bg-white text-[#171717] shadow-2xl", isHebrew ? "right-0" : "left-0")}
          >
            <div className="flex h-[var(--navbar-height)] shrink-0 items-center justify-between border-b border-[#E2DFDA] pe-2 ps-5">
              <Link href="/" onClick={onClose} className="text-[15px] font-semibold uppercase tracking-[.1em] text-[#171717]">
                {tHome("effect_parquet")}
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#F5F5F4]"
              >
                <X className="size-6" strokeWidth={1.75} />
              </button>
            </div>

            <nav aria-label={t("navigation")} className="flex-1 overflow-y-auto px-2.5 py-3">
              {groups.map((items, index) => (
                <ul key={index} className={cn("m-0 grid list-none gap-0.5 p-0", index > 0 && "mt-2 border-t border-[#E2DFDA] pt-2")}>
                  {items.map((item) => {
                    const active = isActive(item);
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex h-12 items-center justify-between gap-3 rounded-xl px-3 text-[17px] text-[#171717] transition-colors",
                            active ? "bg-[#ECEAE7] font-semibold" : "font-medium hover:bg-[#F5F5F4]"
                          )}
                        >
                          {t(item.text)}
                          <ChevronRight
                            className={cn("size-[18px] transition-colors group-hover:text-[#171717] rtl:rotate-180", active ? "text-[#171717]" : "text-[#9A9A9A]")}
                            strokeWidth={1.75}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </nav>

            <div className="shrink-0 border-t border-[#E2DFDA] px-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-5">
              <a href={`tel:${contactData.phone.replace(/[^\d+]/g, "")}`} dir="ltr" className="block w-fit text-2xl font-light tracking-[.01em] text-[#171717] tabular-nums rtl:ms-auto">
                {contactData.phone}
              </a>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#171717] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
                >
                  <MessageSquare className="size-[18px]" strokeWidth={1.75} />
                  WhatsApp
                </a>
                {[
                  { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
                  { icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px] border border-[#DCDCDB] text-[#171717] transition-colors hover:bg-[#F5F5F4]"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

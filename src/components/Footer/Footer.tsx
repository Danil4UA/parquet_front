"use client";

import React from "react";
import { Instagram, Facebook, MessageCircle, Navigation } from "lucide-react";
import { contactData, socialLinks } from "@/Utils/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import RouteConstants from "@/constants/RouteConstants";

/** Dark footer: wordmark, four link columns (catalog, showroom, help, documents), legal line. */
const Footer = () => {
  const t = useTranslations("Footer");
  const tSidebar = useTranslations("Sidebar");
  const currentYear = new Date().getFullYear();

  const columns: { title: string; items: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: tSidebar("catalog"),
      items: [
        { label: tSidebar("wood"), href: "/products/wood" },
        { label: tSidebar("laminate"), href: "/products/laminate" },
        { label: tSidebar("spc"), href: "/products/spc" },
        { label: tSidebar("panels"), href: "/products/panels" },
        { label: tSidebar("cladding"), href: "/products/cladding" },
        { label: t("floor_care"), href: "/products/cleaning" },
      ],
    },
    {
      title: t("help"),
      items: [
        { label: t("installation_delivery"), href: RouteConstants.SERVICES_PAGE },
        { label: t("about_us"), href: RouteConstants.ABOUT_US_PAGE },
        { label: t("contact"), href: RouteConstants.CONTACT_US_PAGE },
      ],
    },
    {
      title: t("documents"),
      items: [
        { label: t("terms_and_conditions"), href: RouteConstants.TERMS_AND_CONDITIONS_PAGE },
        { label: t("privacy_policy"), href: RouteConstants.PRIVACY_POLICY_PAGE },
        { label: t("accessibility"), href: RouteConstants.ACCESSIBILITY_PAGE },
      ],
    },
  ];

  const social = [
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
    { icon: MessageCircle, href: socialLinks.whatsapp, label: "WhatsApp" },
    { icon: Navigation, href: socialLinks.waze, label: "Waze" },
  ];

  const linkClass = "block text-[13px] leading-6 text-[#D6D3CE] transition-colors hover:text-white";

  return (
    <footer className="bg-[#171717] py-9 text-[#D6D3CE]">
      <div className="mx-auto grid max-w-[1180px] gap-[22px] px-4 sm:px-7">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[.06em] text-white">
          {t("made_by")}
        </Link>

        <div className="grid grid-cols-2 gap-[18px] md:grid-cols-4">
          <div>
            <b className="mb-2 block text-[13px] font-medium text-white">{t("showroom")}</b>
            <span className={linkClass}>{t("address")}</span>
            <a href={`tel:${contactData.phone.replace(/[^\d+]/g, "")}`} className={`${linkClass} rtl:text-right`} dir="ltr">{contactData.phone}</a>
            <a href={`mailto:${contactData.email}`} className={linkClass}>{contactData.email}</a>
            <div className="mt-3 flex gap-1.5">
              {social.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <b className="mb-2 block text-[13px] font-medium text-white">{col.title}</b>
              {col.items.map((item) => (
                <Link key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-white/15 pt-4 text-xs text-[#9C9891]">
          © {currentYear} {t("made_by")} · {t("location")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React from "react";
import Image from "next/image";
import logoWhite from "@/app/logo_transparent.png";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle, Navigation } from "lucide-react";
import { contactData, socialLinks } from "@/Utils/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import RouteConstants from "@/constants/RouteConstants";

const Footer = () => {
  const t = useTranslations("Footer");
  const tSidebar = useTranslations("Sidebar");
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: tSidebar("catalog"), href: RouteConstants.ALL_PRODUCTS_PAGE },
    { label: tSidebar("laminate"), href: "/products/laminate" },
    { label: tSidebar("spc"), href: "/products/spc" },
    { label: tSidebar("wood"), href: "/products/wood" },
    { label: t("about_us"), href: RouteConstants.ABOUT_US_PAGE },
    { label: t("services"), href: RouteConstants.SERVICES_PAGE },
    { label: t("contact"), href: RouteConstants.CONTACT_US_PAGE },
  ];

  const legalLinks = [
    { label: t("terms_and_conditions"), href: RouteConstants.TERMS_AND_CONDITIONS_PAGE },
    { label: t("privacy_policy"), href: RouteConstants.PRIVACY_POLICY_PAGE },
    { label: t("accessibility"), href: RouteConstants.ACCESSIBILITY_PAGE },
  ];

  const social = [
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
    { icon: MessageCircle, href: socialLinks.whatsapp, label: "WhatsApp" },
    { icon: Navigation, href: socialLinks.waze, label: "Waze" },
  ];

  const linkClass = "text-sm text-white/65 transition-colors hover:text-white";

  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + contacts */}
          <div className="md:col-span-5 lg:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label={t("made_by")}>
              <Image src={logoWhite} alt="" width={36} height={36} className="size-9" />
              <span className="text-xl font-semibold tracking-[-0.01em]">{t("made_by")}</span>
            </Link>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a href={`tel:${contactData.phone.replace(/\s+/g, "")}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                  <Phone className="size-4 shrink-0" strokeWidth={1.75} />
                  <span dir="ltr" className="tabular-nums">{contactData.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contactData.email}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                  <Mail className="size-4 shrink-0" strokeWidth={1.75} />
                  <span>{contactData.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/65">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                <span>{t("address")}</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              {social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 lg:col-span-6">
            <h3 className="text-sm font-medium text-white/50">{t("quick_links")}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {t("made_by")}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

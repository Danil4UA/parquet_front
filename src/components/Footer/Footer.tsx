"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  Navigation,
} from "lucide-react";
import { contactData, socialLinks } from "@/Utils/utils";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import RouteConstants from "@/constants/RouteConstants";

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const Footer = () => {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const router = useRouter();

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { key: "about_us", page: RouteConstants.ABOUT_US_PAGE },
    { key: "services", page: RouteConstants.SERVICES_PAGE },
    { key: "contact", page: RouteConstants.CONTACT_US_PAGE },
    { key: "terms_and_conditions", page: RouteConstants.TERMS_AND_CONDITIONS_PAGE },
  ];

  const socialIcons = [
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Facebook,  href: socialLinks.facebook,  label: "Facebook"  },
    { icon: MessageCircle, href: socialLinks.whatsapp, label: "WhatsApp" },
    { icon: Navigation,    href: socialLinks.waze,     label: "Waze"     },
  ];

  const handleSocialClick = (href: string) => {
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeVariants}
            transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {t("made_by")}
            </h2>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeVariants}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">
              {t("quick_links")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    className={cn(
                      "text-gray-400 hover:text-white transition-colors duration-200 text-sm",
                      isHebrew ? "text-right w-full" : "text-left"
                    )}
                    onClick={() => router.push(`/${lng}/${link.page}`)}
                  >
                    {t(`${link.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact + Social */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeVariants}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-base font-semibold mb-4 text-white uppercase tracking-wider">
              {t("contact")}
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${contactData.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all">{contactData.email}</span>
              </a>
              <a
                href={`tel:${contactData.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{contactData.phone}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t("address")}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3 text-white uppercase tracking-wider">
                {t("follow_us")}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.div
                      key={social.label}
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeVariants}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <Button
                        onClick={() => handleSocialClick(social.href)}
                        className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all duration-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{social.label}</span>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeVariants}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-10 sm:mt-14 pt-6 border-t border-white/10"
        >
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            © {currentYear} {t("made_by")}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

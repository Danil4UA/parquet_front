"use client";

import React, { useState } from "react";
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
import AboutContent from "./content-components/AboutContent/AboutContent";
import ServicesContent from "./content-components/ServicesContent/ServicesContent";
import ContactContent from "./content-components/ContactContent/ContactContent";
import Modal from "@/shared/ui/Modal/Modal";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const mobileVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const contentComponents: Record<string, React.FC> = {
  about_us: AboutContent,
  services: ServicesContent,
  contact: ContactContent,
};

const Footer = () => {
  const [isShownModal, setIsShownModal] = useState(false);
  const [ModalContent, setModalContent] = useState<React.FC | null>(null);
  const { isMobile } = useIsMobileDebounce();
  const t = useTranslations("Footer");
  const pathname = usePathname();


  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const currentYear = new Date().getFullYear();
  const animationVariants = isMobile ? mobileVariants : fadeInVariants;


  const handleLinkClick = (contentKey: string) => {
      setModalContent(() => contentComponents[contentKey] || null);
      setIsShownModal(true);
    };

  const quickLinks = [
    { key: "about_us" },
    { key: "services" },
    { key: "contact" },
  ];

  const socialIcons = [
    { 
      icon: Instagram, 
      href: socialLinks.instagram, 
      label: "Instagram",
      color_phone: "bg-pink-500",
      color_phone_hover: "hover:bg-pink-600",
      color: "from-pink-500 to-purple-600",
      hoverColor: "hover:from-pink-600 hover:to-purple-700"
    },
    { 
      icon: Facebook, 
      href: socialLinks.facebook, 
      label: "Facebook",
      color_phone: "bg-blue-500",
      color_phone_hover: "hover:bg-blue-600",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800"
    },
    { 
      icon: MessageCircle, 
      href: socialLinks.whatsapp, 
      label: "WhatsApp",
      color_phone: "bg-green-500",
      color_phone_hover: "hover:bg-green-600",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    { 
      icon: Navigation, 
      href: socialLinks.waze, 
      label: "Waze",
      color_phone: "bg-blue-400",
      color_phone_hover: "hover:bg-blue-500",
      color: "from-blue-400 to-blue-500",
      hoverColor: "hover:from-blue-500 hover:to-blue-600"
    }
  ];

  const handleSocialClick = (href: string) => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white">
      {isShownModal && ModalContent && (
        <Modal onClose={() => setIsShownModal(false)}>
          <ModalContent />
        </Modal>
      )}
      
      {!isMobile && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gray-700/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-600/20 rounded-full blur-2xl"></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ 
              duration: isMobile ? 0.2 : 0.6, 
              delay: 0,
              ease: "easeOut"
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <h2 className={cn(
              "text-2xl sm:text-3xl lg:text-4xl font-bold mb-4",
              isMobile 
                ? "text-white" 
                : "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            )}>
              {t("made_by")}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ 
              duration: isMobile ? 0.2 : 0.6, 
              delay: isMobile ? 0.05 : 0.2,
              ease: "easeOut"
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">{t("quick_links")}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.key}
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ 
                    duration: isMobile ? 0.15 : 0.4, 
                    delay: isMobile ? index * 0.02 : (0.3 + index * 0.1),
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <button
                    className={cn(
                      "w-full text-gray-300 hover:text-white transition-colors duration-200 py-1",
                      isHebrew ? "text-right" : "text-left",
                    )}
                    onClick={() => handleLinkClick(link.key)}
                  >
                    {t(`${link.key}`)}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ 
              duration: isMobile ? 0.2 : 0.6, 
              delay: isMobile ? 0.1 : 0.4,
              ease: "easeOut"
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">{t("contact")}</h3>
            <div className="space-y-3 sm:space-y-4">
              <a
                href={`mailto:${contactData.email}`}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 py-1"
              >
                <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm sm:text-base break-all px-2">
                  {contactData.email}
                </span>
              </a>
              
              <a
                href={`tel:${contactData.phone.replace(/\s+/g, "")}`}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 py-1"
              >
                <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm sm:text-base px-2">
                  {contactData.phone}
                </span>
              </a>
              
              <div className="flex items-start text-gray-300 py-1">
                <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm sm:text-base leading-relaxed px-2">
                  {contactData.address}
                </span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-white">{t("follow_us")}</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.div
                      key={social.label}
                      initial="hidden"
                      whileInView="visible"
                      variants={animationVariants}
                      transition={{ 
                        duration: isMobile ? 0.15 : 0.4, 
                        delay: isMobile ? (0.15 + index * 0.02) : (0.5 + index * 0.1),
                        ease: "easeOut"
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <Button
                        onClick={() => handleSocialClick(social.href)}
                        className={cn(
                          "group relative px-3 py-5 rounded-xl transition-all duration-300 overflow-hidden w-full",
                          isMobile 
                            ? `${social.color_phone} ${social.color_phone_hover} border border-gray-600`
                            : `bg-gradient-to-r ${social.color} ${social.hoverColor}`
                        )}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <IconComponent className="w-5 h-5 text-white transition-transform duration-300" />
                          <span className="text-sm font-medium text-white px-2">
                            {social.label}
                          </span>
                        </div>
                        {!isMobile && (
                          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        )}
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
          variants={animationVariants}
          transition={{ 
            duration: isMobile ? 0.2 : 0.6, 
            delay: isMobile ? 0.2 : 0.6,
            ease: "easeOut"
          }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700/50"
        >
          <div className="text-center sm:flex sm:justify-between sm:items-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} {t("made_by")} - {t("all_rights_reserved")}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import "./Footer.css";
import Modal from "@/shared/ui/Modal/Modal";
import ContactContent from "./content-components/ContactContent/ContactContent";
import ServicesContent from "./content-components/ServicesContent/SetvicesContent";
import AboutContent from "./content-components/AboutContent/AboutContent";

const contentComponents: Record<string, React.FC> = {
  about_us: AboutContent,
  services: ServicesContent,
  contact: ContactContent
};

const Footer = () => {
  const [isShownModal, setIsShownModal] = useState(false);
  const [ModalContent, setModalContent] = useState<React.FC | null>(null);

  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  const handleLinkClick = (contentKey: string) => {
    setModalContent(() => contentComponents[contentKey] || null);
    setIsShownModal(true);
  };

  const contactData = {
    email: "effectparquet@gmail.com",
    phone: "0584455478",
    address: "הרצל 110, ראשון לציון"
  };

  return (
    <footer className="footer">
      {isShownModal && ModalContent && (
        <Modal onClose={() => setIsShownModal(false)}>
          <ModalContent />
        </Modal>
      )}
      <div className="footer_container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t("contact_us")}</h3>
            <div className="contact-info">
              <p className="contact-item">
                <span>📧</span>{" "}
                <a href={`mailto:${contactData.email}`} title={contactData.email}>
                  {t("email")}
                </a>
              </p>
              <p className="contact-item">
                <span>📱</span>{" "}
                <a href={`tel:${contactData.phone.replace(/\s+/g, "")}`} title={contactData.phone}>
                  {t("phone")}
                </a>
              </p>
              <p className="contact-item">
                <span>📍</span>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactData.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={contactData.address}
                >
                  {t("address")}
                </a>
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>{t("quick_links")}</h3>
            <ul className="quick-links">
              {["about_us", "services", "contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item);
                    }}
                  >
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("follow_us")}</h3>
            <div className="social-grid">
              {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                <a key={social} href={`#${social}`} className="social-link">
                  {t(social)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} {t("all_rights_reserved")}.<span>{t("made_by")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

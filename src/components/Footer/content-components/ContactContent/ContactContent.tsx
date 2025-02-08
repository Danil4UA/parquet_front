import React from "react";
import { useTranslations } from "next-intl";
import "./ContactContent.css";

const ContactContent = () => {
  const t = useTranslations("ContactContent");

  return (
    <div className="modal-content contact-content">
      <div className="branch-section">
        <h3 className="branch-title">{t("branch_title")}</h3>
        <p className="branch-description">{t("branch_description")}</p>

        <div className="contact-details">
          <p className="address">
            <strong>{t("address_label")}</strong> Улица дом Пушкина, бульвар Калатушкина 3
          </p>
          <p className="phone">
            <strong>{t("phone_label")}</strong> 055-111-11-11
          </p>
        </div>

        <div className="working-hours">
          <h4 className="section-subtitle">{t("working_hours")}</h4>
          <p>{t("hours_weekdays")}</p>
          <p>{t("hours_friday")}</p>
        </div>

        <div className="quick-contacts">
          <p className="highlight">{t("quick_contact")}</p>
          <p>
            {t("contact_person")} <a href="tel:0502011306">050-222-33-33</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactContent;

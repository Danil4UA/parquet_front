import React from "react";
import { useTranslations } from "next-intl";
import "./ServicesContent.css";

const ServicesContent = () => {
  const t = useTranslations("ServicesContent");

  return (
    <div className="modal-content services-content">
      <div className="services-section">
        <h3 className="services-title">{t("services_title")}</h3>

        <div className="service-item">
          <h4 className="service-subtitle">{t("service_parquet_installation_title")}</h4>
          <p className="service-description">{t("service_parquet_installation_desc")}</p>
          <p>{t("service_parquet_installation_extra")}</p>
        </div>

        <div className="service-item">
          <h4 className="service-subtitle">{t("service_material_calc_title")}</h4>
          <p className="service-description">{t("service_material_calc_desc")}</p>
          <p>{t("service_material_calc_extra")}</p>
        </div>

        <div className="service-item">
          <h4 className="service-subtitle">{t("service_consultations_title")}</h4>
          <p className="service-description">{t("service_consultations_desc")}</p>
        </div>

        <div className="service-item">
          <h4 className="service-subtitle">{t("service_repair_title")}</h4>
          <p className="service-description">{t("service_repair_desc")}</p>
          <p>{t("service_repair_extra")}</p>
        </div>

        <div className="service-item">
          <h4 className="service-subtitle">{t("service_maintenance_title")}</h4>
          <p className="service-description">{t("service_maintenance_desc")}</p>
          <p>{t("service_maintenance_extra")}</p>
        </div>
      </div>
    </div>
  );
};

export default ServicesContent;

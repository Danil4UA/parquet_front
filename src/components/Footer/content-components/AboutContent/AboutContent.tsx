import { useTranslations } from "next-intl";
import "./AboutContent.css";

const AboutContent = () => {
  const t = useTranslations("AboutContent");

  return (
    <div className="modal-content about-content">
      <div className="about-section">
        <h3 className="about-title">{t("about_title")}</h3>

        <div className="about-introduction">
          <p>{t("about_intro_1")}</p>
          <p>{t("about_intro_2")}</p>
        </div>

        <div className="about-item">
          <h4 className="about-subtitle">{t("about_mission_title")}</h4>
          <p className="about-description">{t("about_mission_desc_1")}</p>
          <p>{t("about_mission_desc_2")}</p>
        </div>

        <div className="about-item">
          <h4 className="about-subtitle">{t("about_advantages_title")}</h4>
          <div className="about-description">
            <p>{t("about_advantages_1")}</p>
            <p>{t("about_advantages_2")}</p>
            <p>{t("about_advantages_3")}</p>
            <p>{t("about_advantages_4")}</p>
          </div>
        </div>

        <div className="about-item">
          <h4 className="about-subtitle">{t("about_values_title")}</h4>
          <div className="about-description">
            <p>{t("about_values_1")}</p>
            <p>{t("about_values_2")}</p>
            <p>{t("about_values_3")}</p>
            <p>{t("about_values_4")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;

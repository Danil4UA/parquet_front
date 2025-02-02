import CategoryList from "../CategoryList/CategoryList";
import { useTranslations } from "next-intl";
import "./HomeMain.css";

const HomeMain = () => {
  const t = useTranslations("HomePage");

  return (
    <div className="HomeMain">
      <div className="HomeMain__title">
        <span>{t("premium_wood_floors")}</span>
        <p>{t("floor_update_message")}</p>
      </div>
      <CategoryList />
    </div>
  );
};

export default HomeMain;

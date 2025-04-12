"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "./HomeHeader.css";

const HomeHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lng = pathname.split("/")[1];
  const t = useTranslations("HomePage");
  const isHebrew = lng === "he";

  return (
    <div className="HomePage_wrapper">
      <div
        className="HomeHeader__background"
        style={{
          backgroundImage: "url(/assets/3d-rendering-loft-luxury-living-room-with-bookshelf.jpg)"
        }}
      ></div>

      <div className="HomeHeader__wrapper">
        <div className="HomeHeader__content">
          <p>{t("subtitle")}</p>
          <h1 className="HomeHeader__title">
            <span>{t("effect_parquet")}</span>
          </h1>
          <div className="HomeHeader__text">{t("description")}</div>
          <div className="HomeHeader_btn_container">
            <button onClick={() => router.push(`/${lng}/products/all`)} className={`HomeHeader_btn ${isHebrew ? "hebrew-text" : ""}`}>
              {t("view_products")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;

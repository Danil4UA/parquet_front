"use client";
import React from "react";
import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";
import "./HomeHeader.css";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const HomeHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lng = pathname.split("/")[1];
  const t = useTranslations("HomePage");

  return (
    <div className="HomePage_wrapper">
      <ParallaxProvider>
        <ParallaxBanner
          layers={[
            { image: "/assets/3d-rendering-loft-luxury-living-room-with-bookshelf.jpg", speed: -20 },
            {
              children: (
                <div className="HomeHeader__wrapper">
                  <div className="HomeHeader__content">
                    <p>{t("subtitle")}</p>
                    <h1 className="HomeHeader__title">
                      <span>{t("premium")}</span>
                      <br />
                      <span>{t("effect_parquet")}</span>
                    </h1>
                    <div className="HomeHeader__text">{t("description")}</div>
                    <div className="HomeHeader_btn_container">
                      <button onClick={() => router.push(`/${lng}/products/all`)} className="HomeHeader_btn">
                        {t("view_products")}
                      </button>
                    </div>
                  </div>
                </div>
              ),
              speed: 10
            }
          ]}
          className="HomeHeader"
        />
      </ParallaxProvider>
    </div>
  );
};

export default HomeHeader;

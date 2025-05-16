import CategoryCard from "../CategoryCard/CategoryCard";
import { useTranslations } from "next-intl";
import categoryFlooring from "/public/assets/category_flooring_new.jpg"
import categoryLaminate from "/public/assets/category_laminate.jpg"
import categorySpc from "/public/assets/category_spc.jpg"
import categoryWood from "/public/assets/category_wood.jpg"
import categoryCatalog from "/public/assets/category_catalog.jpg"
import categoryPanel from "/public/assets/category_panel.jpg"
import categorySeeling from "/public/assets/category_seeling.jpg"

import "./CategoryList.css";

export type Category = {
  image: string;
  path: string;
  title: string;
  description: string;
};

const CategoryList = () => {
  const t = useTranslations("Categories");
  const categories: Category[] = [
    {
      image: categoryFlooring.src,
      path: "/products/all",
      title: t("catalog_title"),
      description: t("catalog_description")
    },
    {
      image: categoryLaminate.src,
      path: "/products/laminate",
      title: t("laminate_title"),
      description: t("laminate_description")
    },
    {
      image: categorySpc.src,
      path: "/products/spc",
      title: t("spc_title"),
      description: t("spc_description")
    },
    {
      image: categoryWood.src,
      path: "/products/wood",
      title: t("wood_title"),
      description: t("wood_description")
    },
    {
      image: categoryCatalog.src,
      path: "/products/sales",
      title: t("sales_title"),
      description: t("sales_description")
    },
    {
      image: categoryPanel.src,
      path: "/products/panels",
      title: t("panels_title"),
      description: t("panels_description")
    },
    {
      image: categorySeeling.src,
      path: "/products/cladding",
      title: t("cladding_title"),
      description: t("cladding_description")
    },
    {
      image: categoryCatalog.src,
      path: "/products/cleaning",
      title: t("cleaning_title"),
      description: t("cleaning_description")
    },
  ];

  return (
    <div className="CategoryList">
      {categories.map((category) => (
        <CategoryCard key={category.path} category={category} />
      ))}
    </div>
  );
};

export default CategoryList;

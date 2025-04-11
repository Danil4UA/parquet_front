import CategoryCard from "../CategoryCard/CategoryCard";
import { useTranslations } from "next-intl";
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
      image: "/assets/category_flooring_new.jpg",
      path: "/products/all",
      title: t("catalog_title"),
      description: t("catalog_description")
    },
    {
      image: "/assets/category_laminate.jpg",
      path: "/products/laminate",
      title: t("laminate_title"),
      description: t("laminate_description")
    },
    {
      image: "/assets/category_spc.jpg",
      path: "/products/spc",
      title: t("spc_title"),
      description: t("spc_description")
    },
    {
      image: "/assets/category_wood.jpg",
      path: "/products/wood",
      title: t("wood_title"),
      description: t("wood_description")
    },
    {
      image: "/assets/category_catalog.jpg",
      path: "/products/sales",
      title: t("sales_title"),
      description: t("sales_description")
    },
    {
      image: "/assets/category_panel.jpg",
      path: "/products/panels",
      title: t("panels_title"),
      description: t("panels_description")
    },
    {
      image: "/assets/category_safim.jpg",
      path: "/products/thresholds",
      title: t("thresholds_title"),
      description: t("thresholds_description")
    },
    {
      image: "/assets/category_seeling.jpg",
      path: "/products/cladding",
      title: t("cladding_title"),
      description: t("cladding_description")
    }
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

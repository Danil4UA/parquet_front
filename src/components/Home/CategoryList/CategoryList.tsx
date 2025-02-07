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
      image: "/assets/category_flooring.jpg",
      path: "/products/flooring",
      title: t("flooring_title"),
      description: t("flooring_description")
    },
    {
      image: "/assets/category_catalog.jpg",
      path: "/products/sales",
      title: t("sales_title"),
      description: t("sales_description")
    },
    {
      image: "/assets/category_seeling.jpg",
      path: "/products/all",
      title: t("catalog_title"),
      description: t("catalog_description")
    },
    {
      image: "/assets/category_walls.jpg",
      path: "/products/panels",
      title: t("panels_title"),
      description: t("panels_description")
    },
    {
      image: "/assets/category_catalog.jpg",
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

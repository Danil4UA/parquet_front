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
      path: "/products/walls",
      title: t("walls_title"),
      description: t("walls_description")
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

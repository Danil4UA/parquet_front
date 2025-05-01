import Image from "next/image";
import "./CategoryCard.css";
import { Category } from "../CategoryList/CategoryList";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface CategoryCardProps {
  category: Category;
}
const CategoryCard = ({ category }: CategoryCardProps) => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const t = useTranslations("Categories");

  return (
    <div className="CategoryCard">
      <Link href={category.path}>
        <div className="CategoryCard__image_wrapper">
          <div className="CategoryCard__image">
            <Image 
              src={category.image} 
              width={300} 
              height={400} 
              alt={"categoryName"} 
              objectFit="cover"
              />
          </div>
        </div>
        <div className="CategoryCard__content">
          <p className="CategoryCard__title">{category.title}</p>
          <p className="CategoryCard__description">{category.description}</p>
          <div className="HomeHeader_btn_container">
            <button className={`HomeHeader_btn ${isHebrew ? "hebrew-text" : ""}`}>{t("VIEW")}</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;

import Image from "next/image";
import { Category } from "../CategoryList/CategoryList";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";
  const { isMobile } = useIsMobileDebounce();
  const t = useTranslations("Categories");

  return (
    <div className={cn(
      // Базовые стили
      "group relative flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl",
      // Фоновые цвета
      "bg-[var(--background-primary-inverted)]",
      // Размеры для мобильных устройств
      "w-full h-auto min-h-[280px]",
      // Размеры для десктопа
      "md:w-full md:max-w-[300px] md:min-w-[250px] md:h-[550px]",
      // Анимация при наведении
      "hover:scale-[1.02] hover:-translate-y-1"
    )}>
      <Link href={category.path} className="flex flex-col h-full">
        {/* Контейнер изображения */}
        <div className={cn(
          "relative overflow-hidden",
          // Высота для мобильных
          "h-[220px] sm:h-[240px]",
          // Высота для десктопа
          "md:h-[450px]",
          "transition-transform duration-500 group-hover:scale-110"
        )}>
          <Image 
            src={category.image} 
            fill
            alt={category.title} 
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className={cn(
          "flex flex-col flex-1 p-4 text-[var(--color-primary-inverted)]",
          "items-center justify-between",
          "gap-3 md:gap-4"
        )}>
          
          {!isMobile && (
          <h3 className={cn(
            "text-center font-bold leading-tight",
            "text-base sm:text-lg",
            "md:text-xl",
            "line-clamp-2"
          )}>
            {category.title}
          </h3>
          )}
          
          {!isMobile && (<p className={cn(
            "text-center text-[var(--color-secondary-inverted)] leading-relaxed",
            "text-sm",
            "line-clamp-3"
          )}>
            
            {category.description}
          </p>
          )}
          
          <div className="w-full flex justify-center mt-auto">
            <Button 
              className={cn(
                "font-semibold transition-all duration-300 border-2",
                "w-full py-3 px-4 text-sm",
                "md:w-auto md:py-2 md:px-6 md:text-xs",
                "hover:bg-white hover:text-black hover:border-white",
                isHebrew ? "hebrew-text" : "",
                "hover:shadow-md hover:scale-105"
              )}
            >
              {isMobile ? category.title : t("VIEW")}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
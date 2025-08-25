import Image from "next/image";
import { Category } from "../CategoryList/CategoryList";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { isMobile } = useIsMobileDebounce();

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-500",
      "bg-white/95 dark:bg-gray-800/95 border border-gray-100/60 dark:border-gray-700/60",
      "backdrop-blur-md",
      "w-full h-auto",
      "hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20",
      "hover:border-gray-200/80 dark:hover:border-gray-600/80",
      "hover:bg-white dark:hover:bg-gray-800"
    )}>
      <Link href={category.path} className="group block">
        <div className={cn(
          "relative overflow-hidden rounded-xl aspect-[4/5]",
          "shadow-md hover:shadow-xl transition-all duration-300",
          "bg-gray-900"
        )}>
          <Image 
            src={category.image} 
            fill
            alt={category.title} 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
          
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
          
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-shadow-lg drop-shadow-lg">
              {category.title}
            </h3>
            {!isMobile && (
              <p className="text-gray-200 text-sm mb-4 line-clamp-2 drop-shadow-md">
                {category.description}
              </p>
            )}
            
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 shadow-lg">
              <ArrowUpRight className="w-4 h-4 text-white drop-shadow-sm" />
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset"></div>
          </div>
        </div>
      </Link> 
    </div>
  );
};

export default CategoryCard;
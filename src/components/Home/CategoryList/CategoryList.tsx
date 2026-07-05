import CategoryCard from "../CategoryCard/CategoryCard";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import useSalesAvailable from "@/hooks/useSalesAvailable";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

export type Category = {
  image?: string;
  path: string;
  title: string;
  description: string;
};

interface CategoryListProps {
  categoryImages?: Record<string, string>;
}

const CategoryList = ({ categoryImages = {} }: CategoryListProps) => {
  const t = useTranslations("Categories");
  const locale = useLocale();
  const { isMobile } = useIsMobileDebounce();
  const { salesAvailable } = useSalesAvailable(locale);

  // Images are managed from the admin Media page; a card without an image
  // renders on its dark gradient background.
  const categoryImage = (slug: string): string | undefined => categoryImages[slug];

  const categories: Category[] = [
    {
      image: categoryImage("all"),
      path: "/products/all",
      title: t("catalog_title"),
      description: t("catalog_description")
    },
    {
      image: categoryImage("laminate"),
      path: "/products/laminate",
      title: t("laminate_title"),
      description: t("laminate_description")
    },
    {
      image: categoryImage("spc"),
      path: "/products/spc",
      title: t("spc_title"),
      description: t("spc_description")
    },
    {
      image: categoryImage("wood"),
      path: "/products/wood",
      title: t("wood_title"),
      description: t("wood_description")
    },
    {
      image: categoryImage("sales"),
      path: "/products/sales",
      title: t("sales_title"),
      description: t("sales_description")
    },
    {
      image: categoryImage("panels"),
      path: "/products/panels",
      title: t("panels_title"),
      description: t("panels_description")
    },
    {
      image: categoryImage("cladding"),
      path: "/products/cladding",
      title: t("cladding_title"),
      description: t("cladding_description")
    },
    {
      image: categoryImage("cleaning"),
      path: "/products/cleaning",
      title: t("cleaning_title"),
      description: t("cleaning_description")
    },
  ];

  const mobileContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const desktopContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const desktopItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  const containerVariants = isMobile ? mobileContainerVariants : desktopContainerVariants;
  const itemVariants = isMobile ? mobileItemVariants : desktopItemVariants;

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 xl:gap-8 p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1300px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        margin: isMobile ? "-20px" : "-50px"
      }}
    >
      {categories
        .filter((category) => salesAvailable || category.path !== "/products/sales")
        .map((category, index) => (
        <motion.div
          key={category.path}
          variants={itemVariants}
          className="flex justify-center"
          {...(!isMobile && {
            transition: {
              delay: index * 0.05 
            }
          })}
        >
          <CategoryCard category={category} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryList;
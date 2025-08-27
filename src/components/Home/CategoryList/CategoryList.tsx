import CategoryCard from "../CategoryCard/CategoryCard";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import categoryFlooring from "/public/assets/category_flooring_new.jpg"
import categoryLaminate from "/public/assets/category_laminate.jpg"
import categorySpc from "/public/assets/category_spc.jpg"
import categoryWood from "/public/assets/category_wood.jpg"
import categoryCatalog from "/public/assets/category_catalog.jpg"
import categoryPanel from "/public/assets/category_panel.jpg"
import categorySeeling from "/public/assets/category_seeling.jpg"
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

export type Category = {
  image: string;
  path: string;
  title: string;
  description: string;
};

const CategoryList = () => {
  const t = useTranslations("Categories");
  const { isMobile } = useIsMobileDebounce();

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
      className={`
        grid gap-6 p-6 max-w-[1300px] mx-auto
        grid-cols-4
        lg:grid-cols-4
        md:grid-cols-2
        sm:grid-cols-2
        xs:grid-cols-2
        auto-rows-max
        
        xl:gap-8 xl:p-8
        lg:gap-6 lg:p-6
        md:gap-5 md:p-4
        sm:gap-4 sm:p-4
        max-[400px]:grid-cols-2 max-[400px]:gap-3 max-[400px]:p-3
      `}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        margin: isMobile ? "-20px" : "-50px"
      }}
    >
      {categories.map((category, index) => (
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
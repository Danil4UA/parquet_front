import CategoryCard from "../CategoryCard/CategoryCard";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import useSalesAvailable from "@/hooks/useSalesAvailable";
import categoryFlooring from "/public/assets/category_flooring_new.jpg"
import categoryLaminate from "/public/assets/category_laminate.jpg"
import categorySpc from "/public/assets/category_spc.jpg"
import categoryWood from "/public/assets/category_wood.jpg"
import categoryCatalog from "/public/assets/category_catalog.jpg"
import categoryPanel from "/public/assets/category_panel.jpg"
import categorySeeling from "/public/assets/category_seeling.jpg"
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import useSiteContent from "@/hooks/useSiteContent";

export type Category = {
  image: string;
  path: string;
  title: string;
  description: string;
};

const CategoryList = () => {
  const t = useTranslations("Categories");
  const locale = useLocale();
  const { isMobile } = useIsMobileDebounce();
  const { salesAvailable } = useSalesAvailable(locale);
  const { data: contentData } = useSiteContent();

  // Admin-uploaded images (Media page) win over the bundled defaults
  const configuredImages = contentData?.data?.category_images || {};

  const defaultImages: Record<string, string> = {
    all: categoryFlooring.src,
    laminate: categoryLaminate.src,
    spc: categorySpc.src,
    wood: categoryWood.src,
    sales: categoryCatalog.src,
    panels: categoryPanel.src,
    cladding: categorySeeling.src,
    cleaning: categoryCatalog.src,
  };

  const categoryImage = (slug: string) => configuredImages[slug] || defaultImages[slug];

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
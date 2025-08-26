import CategoryList from "../CategoryList/CategoryList";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const HomeMain = () => {
  const t = useTranslations("HomePage");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

     const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start py-4 sm:py-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center px-5 sm:px-6 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" />
          </div>

          <motion.h2 
            variants={fadeInVariants}
            className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent ${
              isHebrew ? "text-right" : "text-left"
            }`}
          >
            {t("premium_wood_floors")}
          </motion.h2>

          <motion.p 
            variants={fadeInVariants}
            className={`text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto ${
              isHebrew ? "text-right" : "text-left"
            }`}
          >
            {t("floor_update_message")}
          </motion.p>

          <div className="flex justify-center mt-8">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
          </div>
        </motion.div>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default HomeMain;

import CategoryList from "../CategoryList/CategoryList";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

const HomeMain = () => {
  const t = useTranslations("HomePage");
  const pathname = usePathname();
  const { isMobile } = useIsMobileDebounce();

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const mobileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const desktopVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const desktopStaggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const mobileStaggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const currentVariants = isMobile ? mobileVariants : desktopVariants;
  const currentContainer = isMobile ? mobileStaggerContainer : desktopStaggerContainer;

  return (
    <div className={`relative ${
      isMobile 
        ? 'bg-gray-50 dark:bg-gray-900' 
        : 'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'
    }`}>
      {!isMobile && (
        <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-start py-4 sm:py-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center px-5 sm:px-6 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={currentContainer}
          transition={{ 
            duration: isMobile ? 0.2 : 0.3,
            ease: "easeOut"
          }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            variants={currentVariants}
          >
            <div className={`w-16 h-1 rounded-full ${
              isMobile 
                ? 'bg-gray-400' 
                : 'bg-gradient-to-r from-gray-400 to-gray-600'
            }`} />
          </motion.div>

          <motion.h2 
            variants={currentVariants}
            className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight ${
              isMobile
                ? 'text-gray-800 dark:text-gray-100'
                : 'bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'
            } ${isHebrew ? "text-right" : "text-left"}`}
          >
            {t("premium_wood_floors")}
          </motion.h2>

          <motion.p 
            variants={currentVariants}
            className={`text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto ${
              isHebrew ? "text-right" : "text-left"
            }`}
          >
            {t("floor_update_message")}
          </motion.p>

          <motion.div 
            className="flex justify-center mt-8"
            variants={currentVariants}
          >
            <div className={`w-24 h-0.5 ${
              isMobile 
                ? 'bg-gray-400' 
                : 'bg-gradient-to-r from-transparent via-gray-400 to-transparent'
            }`} />
          </motion.div>
        </motion.div>

        <motion.div 
          className="w-full max-w-7xl mx-auto px-2 sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={currentVariants}
          transition={{ 
            duration: isMobile ? 0.2 : 0.4, 
            delay: isMobile ? 0.1 : 0.6,
            ease: "easeOut"
          }}
        >
          <CategoryList />
        </motion.div>
      </div>
    </div>
  );
};

export default HomeMain;

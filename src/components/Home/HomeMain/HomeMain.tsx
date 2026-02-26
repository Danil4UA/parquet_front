import CategoryList from "../CategoryList/CategoryList";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const HomeMain = () => {
  const t = useTranslations("HomePage");
  const pathname = usePathname();
  const { isMobile } = useIsMobileDebounce();

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  return (
    <div className="relative bg-gray-50">
      <div className="relative z-10 flex flex-col items-center justify-start py-6 sm:py-10">
        <motion.div
          className="max-w-4xl w-full mx-auto text-center px-5 sm:px-6 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="flex justify-center mb-6" variants={fadeVariants}>
            <div className="w-16 h-0.5 bg-gray-300" />
          </motion.div>

          <motion.h2
            variants={fadeVariants}
            className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight text-gray-800 ${
              isHebrew ? "text-right" : "text-left"
            }`}
          >
            {t("premium_wood_floors")}
          </motion.h2>

          <motion.p
            variants={fadeVariants}
            className={`text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto ${
              isHebrew ? "text-right" : "text-left"
            }`}
          >
            {t("floor_update_message")}
          </motion.p>

          <motion.div className="flex justify-center mt-6" variants={fadeVariants}>
            <div className="w-24 h-px bg-gray-200" />
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full max-w-7xl mx-auto px-2 sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeVariants}
          transition={{
            duration: isMobile ? 0.2 : 0.4,
            delay: isMobile ? 0.1 : 0.3,
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

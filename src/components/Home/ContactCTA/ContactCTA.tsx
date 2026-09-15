"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react";
import { contactData, socialLinks } from "@/Utils/utils";

const ContactCTA = () => {
  const t = useTranslations("Contact");
  const tFooter = useTranslations("Footer");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full bg-gray-50 py-14 px-4"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          {t("need_help")}
        </h2>
        <p className="text-gray-600">
          {t("contact_expert")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-lg bg-[#171717] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
          >
            <MessageSquare className="w-5 h-5" />
            {tFooter("whats_app")}
          </a>

          <a
            href={`tel:${contactData.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-5 h-5" />
            {tFooter("call_us")}
          </a>

          <Link
            href="/contact"
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            {t("contactUs")}
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactCTA;

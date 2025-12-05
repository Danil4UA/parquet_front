"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Wrench, CheckCircle, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InstallationServiceCTA: FC = () => {
  const t = useTranslations("Description");

  const benefits = [
    t("benefit_1"),
    t("benefit_2"),
    t("benefit_3"),
    t("benefit_4"),
  ];

  const scrollToContactForm = () => {
    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      contactForm.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        contactForm.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };
    return (
        <section className="w-full py-4">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left side - Information */}
                        <div className="bg-white border rounded p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Wrench className="w-6 h-6 text-gray-700" />
                            <h2 className="font-bold text-2xl text-gray-900">
                            {t("main_title")}
                            </h2>
                        </div>

                        <Separator />

                        <p className="text-gray-700 leading-relaxed text-base">
                            {t("subtitle")}
                        </p>

                        <div className="space-y-2">
                            {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 py-1"
                            >
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                                <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                            ))}
                        </div>

                            <div className="text-xs min-h-9 text-gray-500 bg-amber-50 p-2 rounded border border-amber-200">
                                {t("special_offer_note")}
                            </div>
                        </div>

                        {/* Right side - CTA */}
                        <div className="bg-white border rounded p-4 space-y-3 flex flex-col">
                            <h3 className="font-bold text-2xl text-gray-900">
                                {t("cta_title")}
                            </h3>
                            
                            <Separator />
                            
                            <p className="text-gray-700 leading-relaxed text-base">
                                {t("cta_description")}
                            </p>

                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                <span className="text-sm text-gray-700">{t("form_info_1")}</span>
                                </div>
                                <div className="flex items-center gap-2 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                <span className="text-sm text-gray-700">{t("form_info_2")}</span>
                                </div>
                                <div className="flex items-center gap-2 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                <span className="text-sm text-gray-700">{t("form_info_3")}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500">
                                {t("response_time")}
                            </p>
                            <Button
                                onClick={scrollToContactForm}
                                size="lg"
                                className="w-full h-9 font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0 rounded-md transition-all duration-300"
                            >
                                <ArrowUp className="w-4 h-4 mr-2" />
                                {t("scroll_to_form_button")}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default InstallationServiceCTA;
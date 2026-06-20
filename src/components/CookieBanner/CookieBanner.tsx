"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";
import RouteConstants from "@/constants/RouteConstants";

const CONSENT_KEY = "cookie_consent";

const CookieBanner = () => {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode / SSR) — show the banner anyway.
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, timestamp: Date.now() }));
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="dialog"
          aria-live="polite"
          aria-label={t("aria_label")}
          className="fixed bottom-0 inset-x-0 z-[300] p-3 sm:p-4"
        >
          <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">
                {t("text")}{" "}
                <Link
                  href={RouteConstants.PRIVACY_POLICY_PAGE}
                  className="text-amber-700 underline underline-offset-2 hover:text-amber-800"
                >
                  {t("learn_more")}
                </Link>
              </p>
            </div>
            <Button
              onClick={accept}
              className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-5 shrink-0"
            >
              {t("accept")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;

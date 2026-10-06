"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

/** Round arrow button that returns to the page the visitor came from; opened directly (no history), it leads to the home page. */
export default function BackButton() {
  const router = useRouter();
  const t = useTranslations("Contact");

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={t("back")}
      title={t("back")}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#DCDCDB] text-[#171717] transition-colors hover:bg-[#F5F5F4] sm:size-11"
    >
      <ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={1.75} />
    </button>
  );
}

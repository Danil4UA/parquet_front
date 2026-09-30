"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

/** Returns to the page the visitor came from; opened directly (no history), it leads to the home page. */
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
      className="-ms-1 flex h-9 w-fit items-center gap-1.5 rounded-full pe-3 ps-1 text-sm font-medium text-[#6B6B6B] transition-colors hover:text-[#171717]"
    >
      <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.75} />
      {t("back")}
    </button>
  );
}

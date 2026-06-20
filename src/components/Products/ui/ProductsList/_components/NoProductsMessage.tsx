"use client";

import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";

const NoProductsMessage = () => {
  const t = useTranslations("Search");

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-5">
        <PackageSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("noResults")}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{t("noResultsHint")}</p>
    </div>
  );
};

export default NoProductsMessage;

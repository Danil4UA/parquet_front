import { FC } from "react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/products";
import { CATEGORY_TITLE_KEYS } from "./productPageUtils";

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: FC<ProductSpecificationsProps> = ({ product }) => {
  const t = useTranslations("Description");
  const tPage = useTranslations("ProductPage");
  const tFilter = useTranslations("Filter");
  const tCategories = useTranslations("Categories");

  const translateValue = (value?: string | null) =>
    value && tFilter.has(value) ? tFilter(value) : value;

  const categoryKey = CATEGORY_TITLE_KEYS[product.category];
  const categoryLabel = categoryKey ? tCategories(categoryKey) : product.category;

  const mm = (value?: string | number | null) => (value ? `${value} ${t("millimeters")}` : null);

  const specifications = [
    { key: "category", label: tPage("specs_category"), value: categoryLabel },
    { key: "model", label: t("specifications_model"), value: product.model },
    { key: "type", label: t("specifications_type"), value: translateValue(product.type) },
    { key: "material", label: tPage("specs_material"), value: translateValue(product.material) },
    { key: "finish", label: t("specifications_finish"), value: product.finish },
    { key: "color", label: t("specifications_color"), value: translateValue(product.color) },
    { key: "length", label: t("specifications_length"), value: mm(product.length) },
    { key: "width", label: t("specifications_width"), value: mm(product.width) },
    { key: "thickness", label: t("specifications_thickness"), value: mm(product.thickness) },
    {
      key: "boxCoverage",
      label: t("specifications_box_coverage"),
      value: product.boxCoverage ? `${product.boxCoverage} ${t("square_meters")}` : null,
    },
  ].filter((spec) => spec.value);

  if (specifications.length === 0) return null;

  return (
    <section aria-labelledby="specs-title" className="space-y-3">
      <h2 id="specs-title" className="text-lg font-semibold text-[#171717]">
        {t("specifications_title")}
      </h2>
      <dl className="grid grid-cols-2 gap-x-6">
        {specifications.map((spec) => (
          <div key={spec.key} className="flex flex-col gap-0.5 border-t border-[#EAEAE9] py-2.5">
            <dt className="text-xs text-[#7A7A7A]">{spec.label}</dt>
            <dd className="text-[15px] font-medium text-[#171717] tabular-nums">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ProductSpecifications;

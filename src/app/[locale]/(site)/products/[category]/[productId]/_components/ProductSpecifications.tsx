import { FC } from "react";
import { useTranslations } from "next-intl";
import { Package, Star, Ruler, Palette } from "lucide-react";
import { Product } from "@/types/products";
import { Separator } from "@/components/ui/separator";

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: FC<ProductSpecificationsProps> = ({ product }) => {
  const t = useTranslations("Description");

  const specifications = [
    {
      key: 'model',
      value: product.model,
      icon: Star,
      label: t("specifications_model")
    },
    {
      key: 'length',
      value: product.length ? `${product.length} ${t("millimeters")}` : null,
      icon: Ruler,
      label: t("specifications_length")
    },
    {
      key: 'width',
      value: product.width ? `${product.width} ${t("millimeters")}` : null,
      icon: Ruler,
      label: t("specifications_width")
    },
    {
      key: 'thickness',
      value: product.thickness ? `${product.thickness} ${t("millimeters")}` : null,
      icon: Ruler,
      label: t("specifications_thickness")
    },
    {
      key: 'color',
      value: product.color,
      icon: Palette,
      label: t("specifications_color")
    },
    {
      key: 'boxCoverage',
      value: product.boxCoverage ? `${product.boxCoverage} ${t("square_meters")}` : null,
      icon: Package,
      label: t("specifications_box_coverage")
    }
  ].filter(spec => spec.value); // Only show specs with values

  if (specifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <h2 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
        {t("specifications_title")}
      </h2>
      
      <Separator />
      
      <div className="space-y-2">
        {specifications.map((spec) => {
          return (
            <div key={spec.key} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {spec.label}
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {spec.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSpecifications;
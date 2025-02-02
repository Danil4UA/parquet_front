import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredList } from "../../model/productsSlice";
import { Product } from "../ProductsList/ProductsList";
import "./ProductSort.css";
import { useTranslations } from "next-intl";
import Select from "@/shared/ui/Select/Select";

const ProductSort = () => {
  const dispatch = useDispatch();
  const productsList = useSelector((state: RootState) => state.products.filteredProducts);
  const t = useTranslations("Filter");

  const sortOptions = [
    { value: "priceAsc", label: t("LowToHight") },
    { value: "priceDesc", label: t("HightToLow") },
    { value: "nameAsc", label: t("AtoZ") },
    { value: "nameDesc", label: t("ZtoA") }
  ];

  const handleSortProducts = (selectedLabel: string) => {
    const sortCriteria = sortOptions.find((option) => option.label === selectedLabel)?.value;

    const sortedList: Product[] = [...productsList].sort((a, b) => {
      const getEffectivePrice = (product: Product) => {
        const discount = product.discount || 0;
        return Number(product.price) * (1 - discount / 100);
      };

      switch (sortCriteria) {
        case "priceAsc":
          return getEffectivePrice(a) - getEffectivePrice(b);
        case "priceDesc":
          return getEffectivePrice(b) - getEffectivePrice(a);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    dispatch(setFilteredList(sortedList));
  };

  return (
    <div className="ProductSort">
      <Select options={sortOptions.map((option) => option.label)} onChange={handleSortProducts} placeholder={t("SortBy")} />
    </div>
  );
};

export default ProductSort;

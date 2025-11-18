import Image from "next/image";
import { COMMON_STYLES, getSectionTitleClass } from "./orderClasses";

interface OrderSummarySectionProps {
  cartItems: any[];
  totalBoxes: Record<string, number>;
  totalArea: Record<string, number>;
  itemTotalPrices: Record<string, number>;
  totalBoxesCount: number;
  deliveryMethod: string;
  totalPrice: number;
  t: (key: string) => string;
  isHebrew: boolean;
  SHIPPING_COST: number;
}

export default function OrderSummarySection ({
  cartItems,
  totalBoxes,
  totalArea,
  itemTotalPrices,
  totalBoxesCount,
  deliveryMethod,
  totalPrice,
  t,
  isHebrew,
  SHIPPING_COST
}: OrderSummarySectionProps){
  return <div className="Order__wrapper_right w-full lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:sticky lg:top-6 h-fit">
    {/* Cart Items */}
    <div className="space-y-4 mb-6">
      <h3 className={getSectionTitleClass(isHebrew)}>
        {t("orderSummary")}
      </h3>
      
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border ">
            <div className="relative flex-shrink-0">
              <Image 
                src={item.images[0]} 
                alt={item.name} 
                width={50} 
                height={50} 
                className="rounded-lg object-cover"
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {item.quantity}
              </div>
            </div>
            
            <div className={`flex-1 min-w-0 overflow-hidden ${isHebrew ? "hebrew-text text-right" : ""}`}>
              <p 
                  className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-1" 
                  title={item.name}
                >
                  {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                </p>
              {item.boxCoverage && (
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{t("inTheBox")} {item.boxCoverage} m²</p>
                  <p>{totalBoxes[item._id]} {t("boxes")} = {totalArea[item._id]} m²</p>
                </div>
              )}
            </div>
            
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {item.price}₪
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Promo Code */}
    <div className="mb-6">
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder={t("enterPromoCode")} 
          className={`
            ${COMMON_STYLES.promoInput}
            ${isHebrew ? "hebrew-text text-right" : ""}
          `}
          aria-label={t("enterPromoCode")}
        />
        <button 
          type="button"
          className={`
            ${COMMON_STYLES.promoButton}
            ${isHebrew ? "hebrew-text" : ""}
          `}
          onClick={() => console.log("Promo code submitted")}
        >
          {t("submit")}
        </button>
      </div>
    </div>

    {/* Order Details */}
    <div className="space-y-3 mb-4">
      {cartItems.map((item) => (
        <div key={`calc-${item._id}`} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`text-gray-700 dark:text-gray-300 font-medium text-sm ${isHebrew ? "hebrew-text" : ""}`}>
              {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
            </span>
            <span className={`font-semibold ${isHebrew ? "hebrew-text" : ""}`}>
              {itemTotalPrices[item._id]}₪
            </span>
          </div>
          <div className={`text-xs text-gray-600 dark:text-gray-400 ${isHebrew ? "hebrew-text text-right" : ""}`}>
            {item.boxCoverage 
              ? `${totalArea[item._id]} m² × ${item.price}₪` 
              : `${item.quantity} × ${item.price}₪`
            }
          </div>
        </div>
      ))}
    </div>

    {/* Summary Lines */}
    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="flex justify-between items-center">
        <span className={`text-gray-700 dark:text-gray-300 ${isHebrew ? "hebrew-text" : ""}`}>
          {t("totalPackages")}:
        </span>
        <span className={`font-medium ${isHebrew ? "hebrew-text" : ""}`}>
          {totalBoxesCount}
        </span>
      </div>
      
      {deliveryMethod === "shipping" && (
        <div className="flex justify-between items-center">
          <span className={`text-gray-700 dark:text-gray-300 ${isHebrew ? "hebrew-text" : ""}`}>
            {t("delivery")}:
          </span>
          <span className={`font-medium ${isHebrew ? "hebrew-text" : ""}`}>
            {SHIPPING_COST}₪
          </span>
        </div>
      )}
    </div>

    {/* Total */}
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <div className={`text-xl font-bold text-gray-900 dark:text-white ${isHebrew ? "hebrew-text" : ""}`}>
            {t("total")}
          </div>
          <div className={`text-xs text-gray-500 dark:text-gray-400 ${isHebrew ? "hebrew-text" : ""}`}>
            {t("includingTaxes")}
          </div>
        </div>
        <div className={`text-xl font-bold text-gray-900 dark:text-white ${isHebrew ? "hebrew-text" : ""}`}>
          <span className="text-sm text-gray-500 dark:text-gray-400">ILS</span>
            {Number(totalPrice).toFixed(2)}₪
        </div>
      </div>
    </div>
  </div>
}
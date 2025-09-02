"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/components/Cart/model/slice/cartSlice";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import productsServices from "@/services/productsServices";
import { usePathname, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderFormType, orderFormSchema } from "@/lib/schemas/orderFormSchema";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import Radio from "@/shared/ui/Radio/Radio";
import "./OrderPage.css";
import ErrorDialog from "@/components/ErrorDialog";
import SuccessDialog from "@/components/SuccessDialog";
import { trackInitiateCheckout, trackPurchase } from "@/lib/fbPixel";

type BoxesMap = Record<string, number>;
type AreaMap = Record<string, number>;
type PriceMap = Record<string, number>;

const SHIPPING_COST = 250;

const OrderPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [subtotalPrice, setSubtotalPrice] = useState<number>(0);
  const [totalBoxes, setTotalBoxes] = useState<BoxesMap>({});
  const [totalArea, setTotalArea] = useState<AreaMap>({});
  const [itemTotalPrices, setItemTotalPrices] = useState<PriceMap>({});
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const router = useRouter();
  const t = useTranslations("Order");
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  
  const totalBoxesCount = useMemo<number>(() => {
    return Object.values(totalBoxes).reduce((sum, count) => sum + Number(count), 0);
  }, [totalBoxes]);
  
  const isHebrew = pathname.split("/")[1] === "he";

  const validationSchema = orderFormSchema(t);

  const orderForm = useForm<OrderFormType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      lastName: "",
      address: "",
      apartment: "",
      postalCode: "",
      city: "",
      phoneNumber: "",
      deliveryMethod: "shipping",
    },
  });

  const { handleSubmit, watch, formState: { errors } } = orderForm;
  const deliveryMethod = watch("deliveryMethod");

  useEffect(() => {
    if (cartItems.length > 0 && totalPrice > 0) {
      const contentIds = cartItems.map(item => item._id);
      const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
      
      trackInitiateCheckout(contentIds, totalQuantity, totalPrice);
    }
  }, [cartItems, totalPrice]);

  useEffect(() => {
    if (deliveryMethod === "shipping") {
      setTotalPrice(subtotalPrice + SHIPPING_COST);
    } else {
      setTotalPrice(subtotalPrice);
    }
  }, [deliveryMethod, subtotalPrice]);

  useEffect(() => {
    let price = 0;
    const boxesObj: BoxesMap = {};
    const areaObj: AreaMap = {};
    const itemPrices: PriceMap = {};

    cartItems.forEach(item => {
      if (item.boxCoverage && item.quantity) {
        const requestedArea = item.quantity; 
        const areaPerBox = Number(item.boxCoverage) || 0;
        const boxesNeeded = Math.ceil(requestedArea / areaPerBox);
        
        boxesObj[item._id] = boxesNeeded;
        
        const actualArea = boxesNeeded * areaPerBox;
        areaObj[item._id] = Number(actualArea.toFixed(2)); 

        const pricePerSqm = Number(item.price); 
        const itemTotal = pricePerSqm * actualArea;
        itemPrices[item._id] = Number(itemTotal.toFixed(2));
        
        price += itemTotal;
      } else {
        boxesObj[item._id] = Number(item.quantity) || 0;
        areaObj[item._id] = item.boxCoverage 
          ? Number((Number(item.quantity) * Number(item.boxCoverage) || 0).toFixed(2)) 
          : 0;
        const itemTotal = Number(item.price) * Number(item.quantity);
        itemPrices[item._id] = Number(itemTotal.toFixed(2));
        price += itemTotal;
      }
    });

    const calculatedSubtotal = Number(price.toFixed(2));
    setSubtotalPrice(calculatedSubtotal);
    
    if (deliveryMethod === "shipping") {
      setTotalPrice(calculatedSubtotal + SHIPPING_COST);
    } else {
      setTotalPrice(calculatedSubtotal);
    }
    
    setTotalBoxes(boxesObj);
    setTotalArea(areaObj);
    setItemTotalPrices(itemPrices);
  }, [cartItems, deliveryMethod]);

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    setOrderNumber("");
    router.push(`/${lng}`);
  };

  const onSubmit = async (data: OrderFormType) => {
    setIsLoading(true);

    const orderData = {
      ...data,
      cartItems: cartItems.map((item) => ({
        id: item._id,
        name: item.name,
        model: item.model,
        quantity: item.quantity,
        price: item.price,
        actualArea: totalArea[item._id] || item.quantity,
        boxes: totalBoxes[item._id] || item.quantity,
        totalPrice: itemTotalPrices[item._id] || (Number(item.price) * Number(item.quantity))
      })),
      shippingCost: deliveryMethod === "shipping" ? SHIPPING_COST : 0,
      totalPrice: totalPrice
    };
    try {
      const response = await productsServices.createOrder(orderData);
      trackPurchase(totalPrice, response.orderNumber);
      setOrderNumber(response.orderNumber)
      setIsSuccessDialogOpen(true)
      dispatch(clearCart());
    } catch {
      setIsErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Order__wrapper">
      <div className="Order__wrapper_left">
      <FormProvider {...orderForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="Delivery__section">
            <div 
                className={`Delivery__section_container ${deliveryMethod === "shipping" ? "selected" : ""}`}
                onClick={() => orderForm.setValue("deliveryMethod", "shipping")}
              >
                <Radio 
                  name="deliveryMethod" 
                  value="shipping" 
                  label={t("shipping")} 
                  containerClass={isHebrew ? "flex-row-reverse" : ""}
                />
              </div>
              <div 
                className={`Delivery__section_container ${deliveryMethod === "pickup" ? "selected" : ""}`}
                onClick={() => orderForm.setValue("deliveryMethod", "pickup")}
              >
                <Radio 
                  name="deliveryMethod" 
                  value="pickup" 
                  label={t("pickup")} 
                  containerClass={isHebrew ? "flex-row-reverse" : ""}
                />
              </div>
            </div>

            <div className="Order__section Order__section--address w-full">
              <TextInputWithLabel<OrderFormType>
                label=""
                nameInSchema="name"
                placeholder={t("name")}
                inputClass={`Order__input--half h-12 ${errors.name ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
              />
              
              <TextInputWithLabel<OrderFormType>
                label=""
                nameInSchema="lastName"
                placeholder={t("lastName")}
                inputClass={`Order__input--half h-12 ${isHebrew ? "hebrew-text" : ""}`}
              />

              {deliveryMethod === "shipping" && (
                <>
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="address"
                    placeholder={t("address")}
                    inputClass={`Order__input h-12 ${isHebrew ? "hebrew-text" : ""}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="apartment"
                    placeholder={t("apartment")}
                    inputClass={`Order__input--half h-12 ${isHebrew ? "hebrew-text" : ""}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="postalCode"
                    placeholder={t("postalCode")}
                    inputClass={`Order__input--half h-12 ${isHebrew ? "hebrew-text" : ""}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="city"
                    placeholder={t("city")}
                    inputClass={`Order__input--half h-12 ${isHebrew ? "hebrew-text" : ""}`}
                  />
                </>
              )}

              <TextInputWithLabel<OrderFormType>
                label=""
                nameInSchema="phoneNumber"
                placeholder={t("phoneNumber")}
                inputClass={`Order__input--half h-12 ${isHebrew ? "hebrew-text" : ""}`}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`complete_order ${isHebrew ? "hebrew-text" : ""}`}
            >
              {isLoading ? t("processing") : t("completeOrder")}
            </button>
          </form>
        </FormProvider>
      </div>
      <div className="Order__wrapper_right flex-1 max-w-md bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md md:sticky md:top-5">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="Order__items flex justify-between items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl transition-shadow hover:shadow-md">
              <div className="Order__items_image relative flex-shrink-0">
                <Image 
                  src={item.images[0]} 
                  alt={item.name} 
                  width={50} 
                  height={50} 
                  className="rounded-lg object-cover"
                />
                <div className="Order__items_count absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-md">
                  <span>{item.quantity}</span>
                </div>
              </div>
              <div className={`Order__items_info flex-grow flex flex-col ${isHebrew ? "hebrew-text text-right" : ""}`}>
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.name || ""}</span>
                {item.boxCoverage && (
                  <>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{t("inTheBox")} {item.boxCoverage || ""} m²</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {totalBoxes[item._id]} {t("boxes")} = {totalArea[item._id]} m²
                    </span>
                  </>
                )}
              </div>
              <div className="price font-semibold text-gray-900 dark:text-white whitespace-nowrap text-sm">{item.price}₪</div>
            </div>
          ))}
        </div>

        <div className="order__footer mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="promo_code flex flex-col sm:flex-row gap-2 mb-4">
            <input 
              type="text" 
              placeholder={t("enterPromoCode")} 
              className={`flex-grow p-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${isHebrew ? "hebrew-text text-right" : ""}`} 
              aria-label={t("enterPromoCode")}
            />
            <button 
              type="button"
              className={`whitespace-nowrap py-2 px-4 bg-black text-white font-medium rounded-xl transition transform hover:-translate-y-0.5 text-sm ${isHebrew ? "hebrew-text text-right" : ""}`}
              onClick={() => console.log("Promo code submitted")}
            >
              {t("submit")}
            </button>
          </div>

          {cartItems.map((item) => (
            <div key={`calc-${item._id}`} className="mb-5">
              <div className="flex justify-between items-center">
                <div className={`text-gray-700 dark:text-gray-300 font-medium ${isHebrew ? "hebrew-text text-right" : ""}`}>
                  {item.name}:
                </div>
                <div className={`font-bold ${isHebrew ? "hebrew-text text-right" : ""}`}>
                  {itemTotalPrices[item._id]}₪
                </div>
              </div>
              <div className={`text-sm text-gray-600 dark:text-gray-400 ${isHebrew ? "hebrew-text text-right" : ""}`}>
                {item.boxCoverage 
                  ? `${totalArea[item._id]} m² × ${item.price}₪` 
                  : `${item.quantity} × ${item.price}₪`
                }
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center py-2">
            <div className={`text-gray-700 dark:text-gray-300 font-medium ${isHebrew ? "hebrew-text text-right" : ""}`}>
              {t("totalPackages")}:
            </div>
            <div className={`font-semibold ${isHebrew ? "hebrew-text text-right" : ""}`}>
              {totalBoxesCount}
            </div>
          </div>
          {deliveryMethod === "shipping" && 
            <div className="flex justify-between items-center py-2">
            <div className={`text-gray-700 dark:text-gray-300 font-medium ${isHebrew ? "hebrew-text text-right" : ""}`}>
              {t("delivery")}:
            </div>
            <div className={`${isHebrew ? "hebrew-text text-right" : ""} ${deliveryMethod === "shipping" ? "font-semibold" : ""}`}>
              {deliveryMethod === "shipping" ? `${SHIPPING_COST}₪` : t("free")}
            </div>
          </div>
          }
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-5">
            <div className="flex justify-between items-center">
              <div>
                <div className={`text-lg sm:text-xl font-bold ${isHebrew ? "hebrew-text text-right" : ""}`}>
                  {t("total")}
                </div>
                <div className={`text-xs text-gray-500 dark:text-gray-400 ${isHebrew ? "hebrew-text text-right" : ""}`}>
                  {t("includingTaxes")}:
                </div>
              </div>
              <div className={`text-lg sm:text-xl font-bold ${isHebrew ? "hebrew-text text-right" : ""}`}>
                <span className={`text-sm text-gray-500 dark:text-gray-400 ${isHebrew ? "hebrew-text text-right" : ""}`}>ILS</span> {totalPrice}₪
              </div>
            </div>
          </div>
        </div>
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          message={t("sentFailedMessage")}
          onCloseDialog={() => setIsErrorDialogOpen(false)}
          title={t("sentFailedTitle")}
        />
        <SuccessDialog
          isOpen={isSuccessDialogOpen}
          setIsOpen={setIsSuccessDialogOpen}
          onClose={handleSuccessDialogClose}
          title={t(`sentSuccessTitle`)}
          text={`${t(`sentSuccessMessage`)} ${orderNumber}`}
        />
      </div>
    </div>
  );
};

export default OrderPage;
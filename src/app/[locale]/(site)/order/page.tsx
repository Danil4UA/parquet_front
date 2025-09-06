"use client";

import { clearCart } from "@/components/Cart/model/slice/cartSlice";
import { Form } from "@/components/ui/form";
import { trackInitiateCheckout, trackPurchase } from "@/lib/fbPixel";
import { orderFormSchema, OrderFormType } from "@/lib/schemas/orderFormSchema";
import { RootState } from "@/redux/store";
import productsServices from "@/services/productsServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DeliveryMethodSection from "./_components/DeliveryMethodSection";
import CustomerInformationSection from "./_components/CustomerInformationSection";
import { COMMON_STYLES } from "./_components/orderClasses";
import OrderSummarySection from "./_components/OrderSummarySection";
import ErrorDialog from "@/components/ErrorDialog";
import SuccessDialog from "@/components/SuccessDialog";
import "./OrderPage.css";

type BoxesMap = Record<string, number>;
type AreaMap = Record<string, number>;
type PriceMap = Record<string, number>;

const SHIPPING_COST = 250;

export default function OrderPage(){
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

  const { handleSubmit, watch } = orderForm;
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
    <div className="Order__wrapper flex flex-col lg:flex-row gap-8">
      <div className="Order__wrapper_left flex-1">
        <Form {...orderForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DeliveryMethodSection
              deliveryMethod={deliveryMethod}
              orderForm={orderForm}
              t={t}
              isHebrew={isHebrew}
            />

            <CustomerInformationSection
              deliveryMethod={deliveryMethod}
              t={t}
              isHebrew={isHebrew}
            />

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`
                  ${COMMON_STYLES.button}
                  ${isHebrew ? "hebrew-text" : ""}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("processing")}
                  </div>
                ) : (
                  t("completeOrder")
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>

      <OrderSummarySection
        cartItems={cartItems}
        totalBoxes={totalBoxes}
        totalArea={totalArea}
        itemTotalPrices={itemTotalPrices}
        totalBoxesCount={totalBoxesCount}
        deliveryMethod={deliveryMethod}
        totalPrice={totalPrice}
        t={t}
        isHebrew={isHebrew}
        SHIPPING_COST={SHIPPING_COST}
      />
      
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
        title={t("sentSuccessTitle")}
        text={`${t("sentSuccessMessage")} ${orderNumber}`}
      />
    </div>
  );
};
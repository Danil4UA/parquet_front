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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DeliveryMethodSection from "./_components/DeliveryMethodSection";
import CustomerInformationSection from "./_components/CustomerInformationSection";
import OrderSummarySection from "./_components/OrderSummarySection";
import ErrorDialog from "@/components/ErrorDialog";
import PageTitleSection from "@/components/Pages/PageTitleSection";
import RouteConstants from "@/constants/RouteConstants";
import { Link } from "@/i18n/routing";
import { ShoppingCart } from "lucide-react";

type BoxesMap = Record<string, number>;
type AreaMap = Record<string, number>;
type PriceMap = Record<string, number>;

const SHIPPING_COST = 250;

// Whole shekels when the sum is round, otherwise two decimals.
const money = (value: number) => `₪${value.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 })}`;

export default function OrderPage(){
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [subtotalPrice, setSubtotalPrice] = useState<number>(0);
  const [totalBoxes, setTotalBoxes] = useState<BoxesMap>({});
  const [totalArea, setTotalArea] = useState<AreaMap>({});
  const [itemTotalPrices, setItemTotalPrices] = useState<PriceMap>({});
  const [unitPrices, setUnitPrices] = useState<PriceMap>({});
  // The cart is restored from localStorage after mount; until then we do not know whether it is empty.
  const [isCartReady, setIsCartReady] = useState(false);

  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const router = useRouter();
  const t = useTranslations("Order");
  const tCart = useTranslations("Cart");
  const tHome = useTranslations("HomePage");
  const tDescription = useTranslations("Description");
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  
  
  useEffect(() => setIsCartReady(true), []);

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
    const units: PriceMap = {};

    cartItems.forEach(item => {
      // Same rule as the cart and the server: the discount applies to the price per unit.
      const unitPrice = item.discount ? Number(item.price) * (1 - item.discount / 100) : Number(item.price);
      units[item._id] = Number(unitPrice.toFixed(2));

      if (item.boxCoverage && item.quantity) {
        const requestedArea = item.quantity; 
        const areaPerBox = Number(item.boxCoverage) || 0;
        const boxesNeeded = Math.ceil(requestedArea / areaPerBox);
        
        boxesObj[item._id] = boxesNeeded;
        
        const actualArea = boxesNeeded * areaPerBox;
        areaObj[item._id] = Number(actualArea.toFixed(2)); 

        const itemTotal = unitPrice * actualArea;
        itemPrices[item._id] = Number(itemTotal.toFixed(2));
        
        price += itemTotal;
      } else {
        boxesObj[item._id] = Number(item.quantity) || 0;
        areaObj[item._id] = item.boxCoverage 
          ? Number((Number(item.quantity) * Number(item.boxCoverage) || 0).toFixed(2)) 
          : 0;
        const itemTotal = unitPrice * Number(item.quantity);
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
    setUnitPrices(units);
  }, [cartItems, deliveryMethod]);

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
      dispatch(clearCart());
      router.push(
        `/${lng}/thank-you?order=${response.orderNumber}&total=${response.totalPrice}&items=${encodeURIComponent(JSON.stringify(orderData.cartItems))}&shipping=${orderData.shippingCost}`
      );
    } catch {
      setIsErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCartReady) return <div className="min-h-[60vh] w-full bg-white" />;

  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-white">
        <PageTitleSection title={tCart("complete")} />
        <div className="mx-auto flex max-w-[1180px] flex-col items-center px-4 py-20 text-center sm:px-7">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[#F5F5F4]">
            <ShoppingCart className="size-7 text-[#6B6B6B]" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-[#171717]">{tCart("cart_is_empty")}</h2>
          <p className="mb-7 text-sm text-[#6B6B6B]">{tCart("add_some_products")}</p>
          <Link
            href={RouteConstants.ALL_PRODUCTS_PAGE}
            className="flex h-[54px] items-center justify-center rounded-[14px] bg-[#171717] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
          >
            {tHome("cta_catalog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={tCart("complete")} />

      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <Form {...orderForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid h-fit gap-10" noValidate>
            <DeliveryMethodSection deliveryMethod={deliveryMethod} shippingCost={SHIPPING_COST} />
            <CustomerInformationSection deliveryMethod={deliveryMethod} />

            <div className="grid gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#171717] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    {t("completeOrder")}
                    <span className="tabular-nums opacity-80">· {money(totalPrice)}</span>
                  </>
                )}
              </button>
              <p className="m-0 text-center text-[13px] text-[#6B6B6B]">
                {tDescription("see_our")}{" "}
                <Link href={RouteConstants.TERMS_AND_CONDITIONS_PAGE} className="font-medium text-[#171717] underline decoration-[#C9C5BE] underline-offset-4 hover:decoration-[#171717]">
                  {tDescription("terms_and_conditions")}
                </Link>
              </p>
            </div>
          </form>
        </Form>

        <OrderSummarySection
          cartItems={cartItems}
          totalBoxes={totalBoxes}
          totalArea={totalArea}
          itemTotalPrices={itemTotalPrices}
          unitPrices={unitPrices}
          deliveryMethod={deliveryMethod}
          shippingCost={SHIPPING_COST}
          totalPrice={totalPrice}
          money={money}
        />
      </div>

      <ErrorDialog
        isOpen={isErrorDialogOpen}
        message={t("sentFailedMessage")}
        onCloseDialog={() => setIsErrorDialogOpen(false)}
        title={t("sentFailedTitle")}
      />
    </div>
  );
};

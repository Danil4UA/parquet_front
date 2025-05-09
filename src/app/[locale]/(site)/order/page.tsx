"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart, selectTotalPrice } from "@/components/Cart/model/slice/cartSlice";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import productsServices from "@/services/productsServices";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderFormType, orderFormSchema } from "@/lib/schemas/orderFormSchema";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import Radio from "@/shared/ui/Radio/Radio";
import "./OrderPage.css";
import ErrorDialog from "@/components/ErrorDialog";
import RouteConstants from "@/constants/RouteConstants";

const OrderPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Order");
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state));

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const orderForm = useForm<OrderFormType>({
    resolver: zodResolver(orderFormSchema),
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

  const onSubmit = async (data: OrderFormType) => {
    setIsLoading(true);

    const orderData = {
      ...data,
      cartItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity
      }))
    };

    try {
      await productsServices.createOrder(orderData);
      Swal.fire({
        icon: "success",
        text: t(`sentSuccess`)
      });
      dispatch(clearCart());
      router.push(RouteConstants.HOMEPAGE_ROUTE)
    } catch {
      setIsErrorDialogOpen(true)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Order__wrapper">
      <div className="Order__wrapper_left">
        <FormProvider {...orderForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Delivery Method Section */}
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
                inputClass={`Order__input--half ${errors.name ? "error" : ""} ${isHebrew ? "hebrew-text" : "h-12"}`}
              />
              
              <TextInputWithLabel<OrderFormType>
                label=""
                nameInSchema="lastName"
                placeholder={t("lastName")}
                inputClass={`Order__input--half ${isHebrew ? "hebrew-text" : "h-12"}`}
              />

              {deliveryMethod === "shipping" && (
                <>
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="address"
                    placeholder={t("address")}
                    inputClass={`Order__input ${isHebrew ? "hebrew-text" : "h-12"}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="apartment"
                    placeholder={t("apartment")}
                    inputClass={`Order__input--half ${isHebrew ? "hebrew-text" : "h-12"}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="postalCode"
                    placeholder={t("postalCode")}
                    inputClass={`Order__input--half ${isHebrew ? "hebrew-text" : "h-12"}`}
                  />
                  
                  <TextInputWithLabel<OrderFormType>
                    label=""
                    nameInSchema="city"
                    placeholder={t("city")}
                    inputClass={`Order__input--half ${isHebrew ? "hebrew-text" : "h-12"}`}
                  />
                </>
              )}

              <TextInputWithLabel<OrderFormType>
                label=""
                nameInSchema="phoneNumber"
                placeholder={t("phoneNumber")}
                inputClass={`Order__input--half ${isHebrew ? "hebrew-text" : "h-12"}`}
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

      <div className="Order__wrapper_right">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="Order__items">
              <div className="Order__items_image">
                <Image src={item.images[0]} alt={item.name} width={60} height={60} />
                <div className="Order__items_count">
                  <span>{item.quantity}</span>
                </div>
              </div>
              <div className={`Order__items_info ${isHebrew ? "hebrew-text" : ""}`}>{item.name}</div>
              <div className="price">{item.price}₪</div>
            </div>
          ))}
        </div>

        <div className="order__footer">
          <div className="promo_code">
            <input type="text" placeholder={t("enterPromoCode")} className={isHebrew ? "hebrew-text" : ""} />
            <button className={isHebrew ? "hebrew-text" : ""}>{t("submit")}</button>
          </div>
          <div className="order__amount">
            <div className={isHebrew ? "hebrew-text" : ""}>{t("totalAmount")}:</div>
            <div className={isHebrew ? "hebrew-text" : ""}>ILS {totalPrice}₪</div>
          </div>

          <div className="order__delivery">
            <div className={isHebrew ? "hebrew-text" : ""}>{t("delivery")}:</div>
            <div className={isHebrew ? "hebrew-text" : ""}>{t("free")}</div>
          </div>
          <div className="order__total">
            <div className="order__total_container">
              <p className={`order__total_sum ${isHebrew ? "hebrew-text" : ""}`}>{t("total")}</p>
              <p className={`order__total_taxes ${isHebrew ? "hebrew-text" : ""}`}>{t("includingTaxes")}: xxx</p>
            </div>
            <div className={`order__total_sum ${isHebrew ? "hebrew-text" : ""}`}>
              <span className={`order__total_taxes ${isHebrew ? "hebrew-text" : ""}`}>ILS</span> {totalPrice}₪
            </div>
          </div>
        </div>
      </div>
         <ErrorDialog
          isOpen={isErrorDialogOpen}
          message={t("sentFailed")}
          onCloseDialog={() => setIsErrorDialogOpen(false)}
          title={t("errorTitle")}
        />
    </div>
  );
};

export default OrderPage;
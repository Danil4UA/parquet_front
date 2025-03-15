"use client";
import { useSelector } from "react-redux";
import "./OrderPage.css";
import { RootState } from "@/redux/store";
import { selectTotalPrice } from "@/components/Cart/model/slice/cartSlice";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import productsServices from "@/services/prodcuts.services";
import Swal from "sweetalert2";
import Radio from "@/shared/ui/Radio/Radio";
import { usePathname } from "next/navigation";

interface FormData {
  name: string;
  lastName: string;
  address: string;
  apartment: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  deliveryMethod: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
}

const OrderPage = () => {
  const [selectedValue, setSelectedValue] = useState("shipping");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    phoneNumber: "",
    deliveryMethod: selectedValue,
    cartItems: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const pathname = usePathname();
  const t = useTranslations("Order");
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state));

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        deliveryMethod: value as "shipping" | "pickup"
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleRadioChange = (value: "shipping" | "pickup") => {
    setSelectedValue(value);
    setFormData((prev) => ({
      ...prev,
      deliveryMethod: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address && formData.deliveryMethod === "shipping") {
      newErrors.address = "Address is required for shipping";
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const orderData = {
      ...formData,
      cartItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity
      }))
    };
    console.log("orderData", orderData);
    try {
      const resultCreate = await productsServices.createOrder(orderData);

      if (resultCreate.success) {
        const result = await productsServices.sendOrderToBackend(orderData);
        Swal.fire({
          icon: "success",
          text: t(`${result.message}`)
        });
      } else {
        Swal.fire({
          icon: "error",
          text: t("sentFailed")
        });
      }
    } catch (error) {
      console.error("Error sending order:", error);
      Swal.fire({
        icon: "error",
        text: t("sentFailed")
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Order__wrapper">
      <div className="Order__wrapper_left">
        <div>
          <div className="Delivery__section">
            <div
              className={`Delivery__section_container ${selectedValue === "shipping" ? "selected" : ""}`}
              onClick={() => handleRadioChange("shipping")}
            >
              <Radio value="shipping" selected={selectedValue === "shipping"} onChange={handleRadioChange} label={t("shipping")} />
            </div>
            <div
              className={`Delivery__section_container ${selectedValue === "pickup" ? "selected" : ""}`}
              onClick={() => handleRadioChange("pickup")}
            >
              <Radio value="pickup" selected={selectedValue === "pickup"} onChange={handleRadioChange} label={t("pickup")} />
            </div>
          </div>
        </div>

        <div className="Order__section Order__section--address">
          <input
            name="name"
            className={`Order__input--half ${errors.name ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("name")}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.name}</span>}

          <input
            name="lastName"
            className={`Order__input--half ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("lastName")}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.lastName}</span>}

          <input
            name="address"
            className={`Order__input ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("address")}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.address}</span>}

          <input
            name="apartment"
            className={`Order__input--half ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("apartment")}
            value={formData.apartment}
            onChange={handleChange}
          />
          {errors.apartment && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.address}</span>}

          <input
            name="postalCode"
            className={`Order__input--half ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("postalCode")}
            value={formData.postalCode}
            onChange={handleChange}
          />
          {errors.postalCode && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.postalCode}</span>}

          <input
            name="city"
            className={`Order__input--half ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("city")}
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.city}</span>}

          <input
            name="phoneNumber"
            className={`Order__input--half ${isHebrew ? "hebrew-text" : ""}`}
            type="text"
            placeholder={t("phoneNumber")}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span className={`error-message ${isHebrew ? "hebrew-text" : ""}`}>{errors.phoneNumber}</span>}
        </div>

        <button className={`complete_order ${isHebrew ? "hebrew-text" : ""}`} onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t("processing") : t("completeOrder")}
        </button>
      </div>
      <div className="Order__wrapper_right">
        {cartItems.map((item) => (
          <div key={item._id} className="Order__items">
            <div className="Order__items_image">
              <Image src={item.images[0]} alt={item.name} width={60} height={60} />
              <div className="Order__items_count">
                <span>{item.quantity}</span>
              </div>
            </div>
            <div className={`Order__items_info ${isHebrew ? "hebrew-text" : ""}`}>{item.name}</div>
            <div className="price">{item.price}</div>
          </div>
        ))}

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
      <div className="order__overlay"></div>
    </div>
  );
};

export default OrderPage;

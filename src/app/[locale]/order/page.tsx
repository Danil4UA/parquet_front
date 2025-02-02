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

interface FormData {
  name: string;
  lastName: string;
  address: string;
  apartment: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  deliveryMethod: "shipping" | "pickup";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
}

const OrderPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    phoneNumber: "",
    deliveryMethod: "shipping",
    cartItems: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const t = useTranslations("Order");
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state));

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
            <div>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="shipping"
                  className="delivery__radio"
                  checked={formData.deliveryMethod === "shipping"}
                  onChange={handleChange}
                />
                {t("shipping")}
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  className="delivery__radio"
                  checked={formData.deliveryMethod === "pickup"}
                  onChange={handleChange}
                />
                {t("pickup")}
              </label>
            </div>
          </div>
        </div>

        <div className="Order__section Order__section--address">
          <input
            name="name"
            className={`Order__input--half ${errors.name ? "error" : ""}`}
            type="text"
            placeholder={t("name")}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}

          <input
            name="lastName"
            className="Order__input--half"
            type="text"
            placeholder={t("lastName")}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}

          <input
            name="address"
            className="Order__input"
            type="text"
            placeholder={t("address")}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}

          <input
            name="apartment"
            className="Order__input--half"
            type="text"
            placeholder={t("apartment")}
            value={formData.apartment}
            onChange={handleChange}
          />
          {errors.apartment && <span className="error-message">{errors.address}</span>}

          <input
            name="postalCode"
            className="Order__input--half"
            type="text"
            placeholder={t("postalCode")}
            value={formData.postalCode}
            onChange={handleChange}
          />
          {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}

          <input
            name="city"
            className="Order__input--half"
            type="text"
            placeholder={t("city")}
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}

          <input
            name="phoneNumber"
            className="Order__input--half"
            type="text"
            placeholder={t("phoneNumber")}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <button className="complete_order" onClick={handleSubmit} disabled={isLoading}>
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
            <div className="Order__items_info">{item.description}</div>
            <div className="price">{item.price}</div>
          </div>
        ))}

        <div className="order__footer">
          <div className="promo_code">
            <input type="text" placeholder={t("enterPromoCode")} />
            <button>{t("submit")}</button>
          </div>
          <div className="order__amount">
            <div>{t("totalAmount")}:</div>
            <div>ILS {totalPrice}₪</div>
          </div>

          <div className="order__delivery">
            <div>{t("delivery")}:</div>
            <div>{t("free")}</div>
          </div>
          <div className="order__total">
            <div className="order__total_container">
              <p className="order__total_sum">{t("total")}</p>
              <p className="order__total_taxes">{t("includingTaxes")}: xxx</p>
            </div>
            <div className="order__total_sum">
              <span className="order__total_taxes">ILS</span> {totalPrice}₪
            </div>
          </div>
        </div>
      </div>
      <div className="order__overlay"></div>
    </div>
  );
};

export default OrderPage;

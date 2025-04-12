import { useDispatch, useSelector } from "react-redux";
import { CartItemType, removeFromCart, updateQuantity } from "../../model/slice/cartSlice";
import "./CartItem.css";
import { RootState } from "@/redux/store";
import { memo, useState, useEffect } from "react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = (props: CartItemProps) => {
  const { name, quantity, images, _id } = props.item;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const item = cartItems.find((cartItem) => cartItem._id === _id);

  // Локальное состояние для input
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());

  useEffect(() => {
    setLocalQuantity(quantity.toString());
  }, [quantity]);

  if (!item) {
    return null;
  }

  const productPriceWithDiscount = item.discount ? Number(item.price) * ((100 - Number(item.discount)) / 100) : Number(item.price);

  const handleIncrement = () => {
    dispatch(updateQuantity({ productId: item._id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ productId: item._id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Обновляем локальное состояние
    setLocalQuantity(value);

    // Если пустое значение — ничего не делаем (разрешаем стирать)
    if (value === "") {
      return;
    }

    // Если 0 — удаляем товар
    if (value === "0") {
      dispatch(removeFromCart(item._id));
      return;
    }

    // Обновляем Redux только при валидном числе
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      dispatch(updateQuantity({ productId: item._id, quantity: parsedValue }));
    }
  };

  return (
    <div className="CartItem">
      <div className="CartItem__image">
        <Image src={images[0]} alt={item.name} width={80} height={80} />
      </div>
      <div className="CartItem__info">
        <p className="CartItem_title">{name}</p>
        <div className="CartItem__info_bottom">
          <div className="CartItem__quantity">
            <button onClick={handleDecrement}>-</button>
            <div>
              <input type="number" value={localQuantity} onChange={handleInputChange} min="0" className="CartItem__input" />
            </div>
            <button onClick={handleIncrement}>+</button>
          </div>
          <div>
            {item.discount ? (
              <div className="product-price__container">
                <span className="product-price__discount">
                  <span className="product-price__currency">₪</span>
                  {productPriceWithDiscount.toFixed()}
                </span>
                <span className="product-price__old">
                  <span className="product-price__currency">₪</span>
                  {item.price}
                </span>
              </div>
            ) : (
              <span className="product-price__current">
                <span className="product-price__currency">₪</span>
                {item.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);

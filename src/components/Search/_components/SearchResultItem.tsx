import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Product } from '@/types/products';

interface SearchResultItemProps {
  product: Product;
  onClose: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ product, onClose }) => {
  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  const productPriceWithDiscount = calculateDiscountedPrice(
    Number(product.price), 
    product.discount
  );

  return (
    <Link
      href={`/products/all/${product._id}`}
      onClick={onClose}
      className="search-result-link"
    >
      <div className="search-result-item">
        <div className="search-result-image">
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            width={80} 
            height={80} 
          />
        </div>
        <div className="search-result-info">
          <p className="search-result-title">{product.name}</p>
          <p className="search-result-text">{product.model}</p>

          <div className="search-result-price">
            {product.discount ? (
              <div className="product-price__container">
                <span className="product-price__discount">
                  <span className="product-price__currency">₪</span>
                  {productPriceWithDiscount.toFixed(0)}
                </span>
                <span className="product-price__old">
                  <span className="product-price__currency">₪</span>
                  {product.price}
                </span>
              </div>
            ) : (
              <span className="product-price__current">
                <span className="product-price__currency">₪</span>
                {product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;
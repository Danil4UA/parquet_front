"use client";

interface NoProductsMessageProps {
  search?: string;
}

const NoProductsMessage = ({ search }: NoProductsMessageProps) => {
  return (
    <div className="no-products-message">
      {search 
        ? `No products found matching "${search}"` 
        : "No products found matching the selected filters."}
    </div>
  );
};

export default NoProductsMessage;
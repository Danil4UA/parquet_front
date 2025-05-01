import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ProductsActionSelectOptionProps {
    icon: ReactNode
    text: string
    onClick?: () => void;
}
function ProductsActionSelectOption({
  icon,
  text,
  onClick,
}: ProductsActionSelectOptionProps) {
  return (
    <Button
      variant="ghost"
      className="text-left p-[12px] rounded"
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-[165px]">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{text}</span>
        </div>
      </div>
    </Button>
  );
}

export default ProductsActionSelectOption;

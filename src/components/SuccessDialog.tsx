import React from "react";
import { CircleCheckBig } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "./ui/dialog";

type ISuccessDialog = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void;
  title: string
  text?: string
}

export default function SuccessDialog({
  isOpen,
  setIsOpen,
  onClose,
  title,
  text,
}: ISuccessDialog) {
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="flex flex-col gap-3 items-center mt-7">
          <CircleCheckBig size={80} className="text-green-600" />
          {text && (
            <p className="text-center text-gray-600 mt-2">
              {text}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
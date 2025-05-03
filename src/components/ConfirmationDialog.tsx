import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type IConfirmationDialog = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  message: string
  onConfirmationClick: () => void
  className?: string
}

export default function ConfirmationDialog({
  isOpen,
  setIsOpen,
  title,
  message,
  onConfirmationClick,
  className,
}: IConfirmationDialog) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p>
            {message}
          </p>
          <div className="flex gap-3 self-center">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              No
            </Button>
            <Button type="button" onClick={onConfirmationClick}>
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

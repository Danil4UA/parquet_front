"use client";

import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type IErrorDialog = {
  isOpen: boolean
  title: string
  message: string
  onCloseDialog: () => void
  isBreakNeeded?: boolean
}

export default function ErrorDialog({
  isOpen, title, message, onCloseDialog, isBreakNeeded = false,
}: IErrorDialog) {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {isBreakNeeded ? (
            <pre className="font-sans">{message}</pre>
          ) : (
            <p className="font-sans">{message}</p>
          )}
          <Button type="button" onClick={onCloseDialog} className="self-center">
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

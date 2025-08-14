"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/src/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui/src/components/drawer";

import { RequestTicketForm } from "./request-ticket-form";

interface RequestTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestTicketModal({
  open,
  onOpenChange,
}: RequestTicketModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Request Your Ticket</DialogTitle>
          </DialogHeader>
          <RequestTicketForm onClose={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Request Your Ticket</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <RequestTicketForm onClose={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

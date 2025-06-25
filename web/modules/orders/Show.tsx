import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ShowProps {
  node: any;
  open: boolean;
  onClose: () => void;
}

export const Show = ({ node, open, onClose }: ShowProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>User: {node?.user.username}</p>
          <p>Date: {node?.createdAt}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

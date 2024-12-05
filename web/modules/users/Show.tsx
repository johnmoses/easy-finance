import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
          <DialogTitle>User</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>User name: {node?.username}</p>
          <p>Mobile: {node?.mobile}</p>
          <p>Email: {node?.email}</p>
          <p>Verified: {node?.isVerified || false}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

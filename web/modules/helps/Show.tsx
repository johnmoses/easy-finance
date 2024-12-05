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
          <DialogTitle>Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Title: {node?.title}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: node?.content as string,
            }}
          />
          <p>Picture: {node?.pic}</p>
          <p>Category: {node?.category?.name}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { apixURL } from "@/clients/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

interface ShowProps {
  data: any;
  open: boolean;
  onClose: () => void;
}

export const Show = ({ data, open, onClose }: ShowProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="relative h-56 overflow-hidden rounded-lg md:h-96">
        <DialogHeader>
          <DialogTitle>Show Banner</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>{data?.title}</p>
          <p>{data?.description}</p>
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${apixURL}/static/uploads/banners/${data?.pic}`}
            layout="fill"
            className="block w-full "
            alt="..."
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

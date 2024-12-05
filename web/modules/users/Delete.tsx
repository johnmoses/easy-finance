import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import { useToast } from "@/components/ui/use-toast";

interface DeleteProps {
  open: boolean;
  onClose: () => void;
}

export const Delete = ({ open, onClose }: DeleteProps) => {
  const { toast } = useToast();
  const { track, close } = useContext(AppContext);
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close account!</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to close this account?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={close}>
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

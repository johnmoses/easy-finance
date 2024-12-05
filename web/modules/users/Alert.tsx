import { HiOutlineExclamationCircle } from "react-icons/hi";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

interface AlertProps {
  open: boolean;
  callback: (yes: boolean) => void;
  onClose: () => void;
}

export const Alert = ({ open, callback, onClose }: AlertProps) => {
  
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Alert</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            You need to sign in to upload testimonies!
          </h3>
          <div className="flex justify-center gap-4">
            <AlertDialogAction color="failure" onClick={() => callback(true)}>
              Yes, sign in
            </AlertDialogAction>
            <AlertDialogCancel color="gray" onClick={onClose}>
              No, cancel
            </AlertDialogCancel>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

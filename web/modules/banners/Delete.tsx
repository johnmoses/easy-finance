import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useContext, useState } from "react";
import { BannerListDocument, useBannerDeleteMutation } from "@/gql/schemas";
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
  node: any;
  prompt?: string;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Delete = ({
  node,
  prompt,
  last,
  open,
  onClose,
}: DeleteProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [bannerDelete] = useBannerDeleteMutation();

  const handleDelete = (e: any) => {
    e.preventDefault();
    bannerDelete({
      variables: { id: node.id, isDeleted: true },
      refetchQueries: [
        {
          query: BannerListDocument,
          variables: {
            last: last,
            isDeleted: false,
          },
        },
      ],
    })
      .then(() => {
        onClose();
        toast({
          title: "Banner  deleted",
          description: "You have deleted one banner",
        });
        track("Delete banner", `Id: ${node.id} `);
      })
      .catch(() => {
        setMessage("");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Banner</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <div>{message}</div>
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to {prompt} {node?.title}?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={(e) => handleDelete(e)}>
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { UserSelectDocument, useAdminToggleMutation } from "@/gql/schemas";
import { useApolloClient } from "@apollo/client";
import React, { useContext, useState } from "react";

interface IProps {
  node: any;
  open: boolean;
  onClose: () => void;
}

export const ToggleAdmin = ({ node, open, onClose }: IProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const client = useApolloClient();
  const [isAdmin, setIsAdmin] = useState(node?.isAdmin);

  const [message, setMessage] = useState("");
  const [adminToggle] = useAdminToggleMutation();

  const handleToggleAdmin = (e: any) => {
    adminToggle({
      variables: {
        id: node?.id,
        isAdmin: isAdmin,
      },
      refetchQueries: [
        {
          query: UserSelectDocument,
          variables: {
            id: node?.id,
          },
        },
      ],
    })
      .then(() => {
        setMessage("");
        onClose();
        toast({
          title: "Admin toggled",
          description: "You have toggled one admin",
        });
        track("Toggled admin", `${node.id} `);
      })
      .catch(() => {
        setMessage("Cannot toggle admin this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Toggle Admin</DialogTitle>
        </DialogHeader>
        <div>{message}</div>
        <div
          style={{ height: "22rem", backgroundColor: "black", color: "white" }}
        >
          <div className="space-y-6">
            <p>User name: {node?.username}</p>
            <p>Mobile: {node?.mobile}</p>
            <p>Email: {node?.email}</p>
          </div>
          <div>
            <Label htmlFor="admin" className="flex">
              Admin?
            </Label>
            <Checkbox
              id="admin"
              value={isAdmin}
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={(e: any) => handleToggleAdmin(e)}>Save</Button>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

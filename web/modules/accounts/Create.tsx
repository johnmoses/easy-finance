import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { useAccountCreateMutation } from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface CreateProps {
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({ last, open, onClose }: CreateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [categoryId, setCategoryId] = useState("");
  const [currency, setCurrency] = useState("");
  const [message, setMessage] = useState("");
  const [accountCreate] = useAccountCreateMutation();

  const validateEntries = () => {
    if (categoryId === "") {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    accountCreate({
      variables: {
        categoryId: categoryId,
        currency: currency,
      },
    })
      .then(() => {
        setCategoryId("");
        setCurrency("");
        setMessage("");
        onClose();
        toast({
          title: "Account created",
          description: "You have created account",
        });
        track("Created account", `${name} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" />
            </div>
            <Input
              id="currency"
              value={currency}
              placeholder="Currency"
              required
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={validateEntries()}>
            Create
          </Button>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

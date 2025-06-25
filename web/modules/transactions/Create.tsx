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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { useTransactionCreateMutation } from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface CreateProps {
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({ last, open, onClose }: CreateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [amount, setAmount] = useState<any>(0);
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("")
  const [message, setMessage] = useState("");
  const [transactionCreate] = useTransactionCreateMutation();

  const validateEntries = () => {
    if (amount === "") {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    transactionCreate({
      variables: {
        amount: amount,
        description: description,
        accountId: accountId
      },
    })
      .then(() => {
        setAmount("");
        setDescription("");
        setMessage("");
        onClose();
        toast({
          title: "Transaction created",
          description: "You have created transaction",
        });
        track("Created transaction", `${name} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" />
            </div>
            <Input
              id="amount"
              value={amount}
              placeholder="Amount"
              required
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" />
            </div>
            <Textarea
              id="description"
              value={description}
              placeholder="Description"
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
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

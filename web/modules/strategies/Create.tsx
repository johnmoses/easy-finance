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
import { useStrategyCreateMutation } from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface CreateProps {
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({ last, open, onClose }: CreateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [strategyCreate] = useStrategyCreateMutation();

  const validateEntries = () => {
    if (name === "") {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    strategyCreate({
      variables: {
        name: name,
      },
    })
      .then(() => {
        setName("");
        setMessage("");
        onClose();
        toast({
          title: "Strategy created",
          description: "You have created strategy",
        });
        track("Created strategy", `${name} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Strategy</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" />
            </div>
            <Input
              id="name"
              value={name}
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
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

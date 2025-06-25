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
import { useAccountCategoryCreateMutation } from "@/gql/schemas";
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
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [categoryCreate] = useAccountCategoryCreateMutation();

  const validateEntries = () => {
    if (name === "") {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    categoryCreate({
      variables: {
        name: name,
        description: description,
      },
    })
      .then(() => {
        setName("");
        setDescription("");
        setMessage("");
        onClose();
        toast({
          title: "Account category created",
          description: "You have created account category",
        });
        track("Created account category", `${name} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Account Category</DialogTitle>
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

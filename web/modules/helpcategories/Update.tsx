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
import { CategorySelectDocument, useCategoryUpdateMutation } from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface UpdateProps {
  node: any;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Update = ({ node, last, open, onClose }: UpdateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [name, setName] = useState(node?.name);
  const [description, setDescription] = useState(node?.description);
  const [pic, setPic] = useState(node?.pic);
  const [message, setMessage] = useState("");
  const [categoryUpdate] = useCategoryUpdateMutation();

  const init = () => {
    setName(node?.name);
    setDescription(node?.description);
    setPic(node?.pic);
  };

  React.useEffect(() => {
    init();
  }, [node]);

  const validateEntries = () => {
    if (node?.name === undefined) {
      return true;
    }
    return false;
  };

  const handleUpdate = () => {
    categoryUpdate({
      variables: {
        id: node.id,
        name: name,
        description: description,
        pic: pic,
      },
      refetchQueries: [
        {
          query: CategorySelectDocument,
          variables: {
            id: node?.id,
          },
        },
      ],
    })
      .then(() => {
        setName("");
        setDescription("");
        setPic("");
        onClose();
        toast({
          title: "Help Category updated",
          description: "You have updated help category",
        });
        track("Updated help category", `${node.id} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Help Category</DialogTitle>
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
          <Button onClick={handleUpdate} disabled={validateEntries()}>
            Update
          </Button>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

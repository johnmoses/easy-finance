import StarIconButton from "@/components/review/StarIconButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { useReviewCreateMutation } from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface CreateProps {
  itemId?: any;
  itemType?: any;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({
  itemId,
  itemType,
  last,
  open,
  onClose,
}: CreateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<any>(0);
  const [message, setMessage] = useState("");
  const [reviewCreate] = useReviewCreateMutation();

  const validateEntries = () => {
    if (rating === 0) {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    reviewCreate({
      variables: {
        content: content,
        rating: parseFloat(rating),
        itemId: itemId,
        itemType: itemType,
      },
      // refetchQueries: [
      //   {
      //     query: ReviewListDocument,
      //     variables: {
      //       last: last,
      //       itemId: itemId,
      //     },
      //   },
      // ],
    })
      .then(() => {
        setContent("");
        setRating(0);
        setMessage("");
        onClose();
        toast({
          title: "Review Created",
          description: "You have created a review",
        });
        track("Created review", `${rating} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <section className="mt-2 mb-6">
            <label className="text-gray-600 text-sm">Rating</label>
            <div className="gap-1 w-32 my-2">
              {Array.from(Array(5)).map((value: undefined, i: number) => (
                <StarIconButton
                  key={i}
                  filled={rating >= i + 1}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </section>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="content" />
            </div>
            <Textarea
              id="content"
              value={content}
              placeholder="Comment"
              required
              onChange={(e) => setContent(e.target.value)}
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

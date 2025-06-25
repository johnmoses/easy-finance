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
import { AccountCategoryListDocument, AccountCategoryListQuery, useOrderCreateMutation } from "@/gql/schemas";
import { SelectorObject } from "@/types";
import { useApolloClient } from "@apollo/client";
import React, { useContext, useState } from "react";

interface CreateProps {
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({ last, open, onClose }: CreateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const client = useApolloClient();
  const [quantity, setQuantity] = useState<any>(0);
  const [buyPrice, setBuyPrice] = useState<any>(0);
  const [sellPrice, setSellPrice] = useState<any>(0);
  const [accountId, setAccountId] = useState<any>();
  const [strategyId, setStrategyId] = useState<any>();
  const [stockId, setStockId] = useState<any>();
  const [categoryData, setCategoryData] = React.useState<SelectorObject[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [message, setMessage] = useState("");
  const [orderCreate] = useOrderCreateMutation();


  React.useEffect(() => {
    getCategoryData();
  }, [open]);

  const getCategoryData = async () => {
    let data: SelectorObject[] = [];
    try {
      const res = await client.query<AccountCategoryListQuery>({
        query: AccountCategoryListDocument,
      });
      if (res !== undefined) {
        const categories = res?.data?.accountcategories?.edges;
        categories?.forEach((obj) => {
          data.push({ value: obj?.node?.id, label: obj?.node?.name });
        });
      }
      setCategoryData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (value: any) => {
    setSelectedCategory(value);
    // setCategoryId(value.value);
  };

  const validateEntries = () => {
    if (quantity === 0) {
      return true;
    }
    return false;
  };

  const handleCreate = async () => {
    orderCreate({
      variables: {
        quantity: quantity,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        accountId: accountId,
        strategyId: strategyId,
        stockId: stockId,
      },
    })
      .then(() => {
        setQuantity(0)
        setBuyPrice(0)
        setSellPrice(0)
        setMessage("");
        onClose();
        toast({
          title: "Order created",
          description: "You have created an order",
        });
        track("Created an order", `${name} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" />
            </div>
            <Input
              id="quantity"
              value={quantity}
              placeholder="Quantity"
              required
              onChange={(e) => setQuantity(e.target.value)}
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

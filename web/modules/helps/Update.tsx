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
// import { Textarea } from "@/components/ui/textarea";
import {
  CategoryListDocument,
  CategoryListQuery,
  HelpSelectDocument,
  useCategoryListQuery,
  useHelpUpdateMutation,
} from "@/gql/schemas";
import { SelectorObject } from "@/types";
import { useApolloClient } from "@apollo/client";
import React, { useContext, useState } from "react";
import Select from "react-tailwindcss-select";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";

interface UpdateProps {
  node: any;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Update = ({ node, last, open, onClose }: UpdateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const client = useApolloClient();
  const { data } = useCategoryListQuery();
  const [title, setTitle] = useState(node?.title);
  const [content, setContent] = useState(node?.content);
  const [pic, setPic] = useState("");
  const [categoryId, setCategoryId] = useState<any>(node?.category?.id);
  const [categoryData, setCategoryData] = React.useState<SelectorObject[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [message, setMessage] = useState("");
  const [helpUpdate] = useHelpUpdateMutation();

  const init = () => {
    setTitle(node?.title);
    setContent(node?.content);
    setPic(node?.pic);
    setCategoryId(node?.category?.id);
  };

  React.useEffect(() => {
    init();
    getCategoryData();
  }, [node]);

  const getCategoryData = async () => {
    let data: SelectorObject[] = [];
    try {
      const res = await client.query<CategoryListQuery>({
        query: CategoryListDocument,
      });
      if (res !== undefined) {
        const categories = res?.data?.categories?.edges;
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
    setCategoryId(value.value);
    console.log("value: ", value);
  };

  const validateEntries = () => {
    if (node?.title === undefined || title === undefined) {
      return true;
    }
    return false;
  };

  const handleUpdate = () => {
    helpUpdate({
      variables: {
        id: node.id,
        title: title,
        content: content,
        pic: pic,
        categoryId: categoryId,
      },
      refetchQueries: [
        {
          query: HelpSelectDocument,
          variables: {
            id: node?.id,
          },
        },
      ],
    })
      .then(() => {
        setTitle("");
        setContent("");
        setPic("");
        onClose();
        toast({
          title: "Help updated",
          description: "You have updated a help topic",
        });
        track("Updated help", `${title} `);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Help</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="category" />
            </div>
            <Select
              value={selectedCategory}
              options={categoryData}
              onChange={handleChange}
              primaryColor="indigo"
              isSearchable={true}
              classNames={
                {
                  // menu: "absolute z-10 w-full bg-inherit shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                }
              }
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" />
            </div>
            <Input
              id="title"
              value={title}
              placeholder="Title"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* <div>
            <div className="mb-2 block">
              <Label htmlFor="content" />
            </div>
            <Textarea
              id="content"
              value={content}
              rows={3}
              onChange={(e) => setContent(e.target.value)}
            />
          </div> */}
          <Editor
            value={content}
            init={{
              height: 300,
              menubar: false,
              plugins: ["link", "image"],
            }}
            onEditorChange={setContent}
            apiKey="sa2pbr7os30o20unzuv40c71kryv3izrw6lx71nkp0hyp3qr"
          />
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

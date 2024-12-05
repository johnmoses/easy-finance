import { apixClient } from "@/clients/axios";
import { apixURL } from "@/clients/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  BannerSelectDocument,
  useBannerUpdateMutation,
} from "@/gql/schemas";
import { RootState } from "@/store";
import React, { ChangeEvent, useContext, useState } from "react";
import { useSelector } from "react-redux";

interface UpdateProps {
  node: any;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Update = ({ node, last, open, onClose }: UpdateProps) => {
  const state = useSelector((state: RootState) => state.app);
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(node?.title);
  const [content, setContent] = useState(node?.content);
  const [pic, setPic] = useState(node?.pic);
  const [isActive, setIsActive] = useState(node?.isActive);
  const [message, setMessage] = useState("");
  const [bannerUpdate] = useBannerUpdateMutation();

  const init = () => {
    setTitle(node?.title);
    setContent(node?.content);
    setPic(node?.pic);
    setIsActive(node?.isActive);
  };

  React.useEffect(() => {
    init();
  }, [node]);

  const validateEntries = () => {
    if (node?.title === undefined || pic === undefined) {
      return true;
    }
    return false;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
    if (selectedFile && selectedFile.size <= 2100000) {
      const fname = selectedFile.name;
      const userid = state.authUserIdPk as string;
      const utime = Math.floor(Date.now() / 1000).toString();
      const fext = fname.split(".").pop();
      const filename = userid + utime + "." + fext;
      setPic(filename);
      console.log('selected: ', filename + ' size: ' + selectedFile.size)
    } else {
      setMessage("Selected file is above 2MB");
      setFile(null);
      setPic("");
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (file) {
      bannerUpdate({
        variables: {
          id: node.id,
          title: title,
          content: content,
          pic: pic,
          isActive: isActive,
        },
        refetchQueries: [
          {
            query: BannerSelectDocument,
            variables: {
              id: node?.id,
            },
          },
        ],
      })
        .then(() => {
          setTitle("");
          setContent("");
          setMessage("");
          onClose();
          toast({
            title: "Banner  updated",
            description: "You have updated one banner",
          });
          track("Updated banner", `Title: ${title} `);
        })
        .catch((er) => {
          setMessage("Cannot add content this time! ");
          // console.log(er);
        });
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", pic);
        formData.append("destination", "banners");
        // formData.append('userid', state.authUserIdPk);

        const response = await apixClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });
        console.log(response);
        console.log("uploaded file: ", pic);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="content" />
            </div>
            <Textarea
              id="content"
              value={content}
              rows={3}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <img
            sizes="(max-width: 100px) 80vw"
            src={`${apixURL}/static/uploads/banners/${node?.pic}`}
            className="block w-full "
            alt="..."
          />
          <input
            name="file"
            type="file"
            accept=".jpeg, .jpg, .png"
            onChange={(e) => handleFileChange(e)}
          />
          <div>Accepting '.jpeg', '.jpg', '.png' maximum 2MB</div>
          <div>
            <Checkbox
              id="remitted"
              value={isActive}
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="remitted" className="flex">
              Active
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={(e) => handleUpdate(e)} disabled={validateEntries()}>
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

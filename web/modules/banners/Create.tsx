import { apixClient } from "@/clients/axios";
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
import { useBannerCreateMutation } from "@/gql/schemas";
import { RootState } from "@/store";
import React, { ChangeEvent, useContext, useState } from "react";
import { useSelector } from "react-redux";

interface CreateProps {
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Create = ({ last, open, onClose }: CreateProps) => {
  const state = useSelector((state: RootState) => state.app);
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pic, setPic] = useState("");
  const [message, setMessage] = useState("");
  const [bannerCreate] = useBannerCreateMutation();

  const validateEntries = () => {
    if (title === "" || pic === "") {
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
      const fext = fname.split('.').pop();
      const filename = userid + utime + '.' + fext
      setPic(filename);
      console.log('selected: ', filename + ' size: ' + selectedFile.size)
    }else {
      setMessage('Selected file is above 2MB')
      setFile(null);
      setPic('');
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (file) {
      bannerCreate({
        variables: {
          title: title,
          content: content,
          pic: pic,
        },
      })
        .then(() => {
          setTitle("");
          setContent("");
          setMessage("");
          onClose();
          toast({
            title: "Banner  created",
            description: "You have created one banner",
          });
          track("Create banner", `Title: ${title} `);
        })
        .catch(() => {
          setMessage("Cannot add content this time!");
        });
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', pic);
        formData.append('destination', 'banners')
        // formData.append('userid', state.authUserIdPk);

        const response = await apixClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });
        console.log(response);
        console.log('uploaded file: ', pic);
      }
      catch (e) {
        console.log(e)
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Banner</DialogTitle>
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
          <input
            name="file"
            type="file"
            accept=".jpeg, .jpg, .png"
            onChange={(e) => handleFileChange(e)}
          />
          <div>Accepting '.jpeg', '.jpg', '.png' maximum 2MB</div>
        </div>
        <DialogFooter>
          <Button onClick={(e) => handleCreate(e)} disabled={validateEntries()}>
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

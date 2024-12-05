import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apixClient } from "@/clients/axios";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import React, { ChangeEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "@/context/AppContext";

export const UpdatePic = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const { track } = useContext(AppContext);
  const [chat, setChat] = useState<any>("");
  const [pic, setPic] = useState<string>(chat.pic);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const getChat = async () => {
    apixClient
      .get(`/chat/${chatState.activeId}`)
      .then((response) => {
        setChat(response.data);
        setPic(response.data.pic);
      })
      .catch((e: any) => {
        track("no data", e);
      });
  };

  React.useEffect(() => {
    getChat();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
    if (selectedFile) {
      const fname = selectedFile.name;
      const userid = state.authUserIdPk as string;
      const utime = Math.floor(Date.now() / 1000).toString();
      const fext = fname.split(".").pop();
      const filename = userid + utime + "." + fext;
      setPic(filename);
    }
  };

  const handleUpdatePic = async (e: any) => {
    e.preventDefault();
    if (file) {
      apixClient
        .put("/chat/pic", {
          user_id: state.authUserIdPk,
          id: chatState.activeId,
          pic: pic,
        })
        .then((response) => {
          if (response.status === 200) {
            track("Changed chat pic", `Ids: ${pic} `);
          } else {
            track("Change not successful", response.statusText);
          }
        })
        .catch((e: any) => {
          track("Change not successful", e);
        });
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", pic);
        formData.append("destination", "chats");
        // formData.append("userid", state.authUserIdPk);

        const response = await apixClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });
        console.log(response.statusText);
        handleClose();
      } catch (e: any) {
        setMessage("Cannot update picture!");
        track("Cannot update picture! ", e);
      }
    }
  };

  const handleClose = () => {
    dispatch(setChatModal(4));
  };

  return (
    <div>
      <p>Update {chat.name} picture</p>
      <div>
        <div>{message}</div>
        <div className="mb-2 block">
          <Label htmlFor="name" />
        </div>
        <div>
          <input
            id="file-input"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
          />
        </div>
        <p>Accepted file formats: .jpg, .jpeg, .png</p>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={handleUpdatePic} disabled={!file}>
            Update Picture
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={() => handleClose()} style={{ cursor: "pointer" }}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

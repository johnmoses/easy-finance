import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apixClient } from "@/clients/axios";
import { socket } from "@/clients/socket";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "@/context/AppContext";

export const Update = () => {
  const dispatch = useDispatch();
  const chatState = useSelector((state: RootState) => state.chat);
  const { track } = useContext(AppContext);
  const [chat, setChat] = useState<any>("");
  const [name, setName] = useState<string>(chat.name);
  const [description, setDescription] = useState<string>(chat.description);
  const [message, setMessage] = useState("");

  const getChat = async () => {
    apixClient
      .get(`/chat/${chatState.activeId}`)
      .then((response) => {
        setChat(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
      })
      .catch((e: any) => {
        track("no data", e);
      });
  };

  React.useEffect(() => {
    getChat();
  }, []);

  const handleUpdateChat = () => {
    socket.emit("update chat", {
      id: chatState.activeId,
      name: name,
      description: description,
    });
    dispatch(setChatModal(4));
  };

  const handleClose = (e: any) => {
    dispatch(setChatModal(4));
  };

  return (
    <div>
      <p>Update {chat.name}</p>
      <div>
        <div>{message}</div>
        <div className="mb-2 block">
          <Label htmlFor="name" />
        </div>
        <Input
          id="name"
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="description"
          value={description}
          placeholder="Description"
          required
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={handleUpdateChat}>Update</Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={(e) => handleClose(e)} style={{ cursor: "pointer" }}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { apixClient } from "@/clients/axios";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import React, { useContext, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "@/context/AppContext";
import { socket } from "@/clients/socket";

export const AddParticipant = () => {
  const dispatch = useDispatch();
  const { track } = useContext(AppContext);
  const chatState = useSelector((state: RootState) => state.chat);
  let [userData, setUserData] = React.useState<any[]>([]);

  const [message, setMessage] = useState("");
  const [userids, setUserids] = useState("");
  const [selected, setSelected] = useState([]);

  const getUserData = async () => {
    let data: any[] = [];
    apixClient
      .get(`/user`)
      .then((response) => {
        const users = response.data;
        users.forEach((obj: any) => {
          data.push({
            value: obj.id,
            label: obj.username,
          });
        });
        setUserData(data);
      })
      .catch((e:any) => {
        track("no data", e);
      });
  };

  React.useEffect(() => {
    getUserData();
    handleUserIds();
  }, [selected]);

  const handleUserIds = () => {
    const selectedUsers = selected.map(({ value }) => `${value}`).join(",");
    setUserids(selectedUsers);
  };

  const handleAddParticipant = async () => {
    socket.emit("join chat", {
      chat_id: chatState.activeId,
      user_ids: userids,
    });
    handleClose();
    track("Joining: ", `${userids}`);
  };

  const handleClose = () => {
    dispatch(setChatModal(4));
  };

  return (
    <div>
      <p>Add Participants</p>
      <div style={{ backgroundColor: "black", color: "purple" }}>
        <MultiSelect
          options={userData}
          value={selected}
          onChange={setSelected}
          labelledBy="Select"
        />
      </div>
      <Button
        onClick={() => handleAddParticipant()}
        disabled={userids === ""}
      >
        Add
      </Button>
      <Button onClick={() => handleClose()}>Close</Button>
    </div>
  );
};

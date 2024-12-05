import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apixClient } from "@/clients/axios";
import { socket } from "@/clients/socket";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import React, { useContext, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { SearchBox } from "@/components/search/SearchBox";
import { setHasAssist } from "@/store/slices/app";

export const Create = () => {
  const state = useSelector((state: RootState) => state.app);
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const dispatch = useDispatch();
  let [userData, setUserData] = React.useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [userids, setUserids] = useState("");
  const [selected, setSelected] = useState([]);

  const getChatsNames = async () => {
    apixClient
      .post('/chats', {
        name: searchedName,
        last: 50,
      })
      .then((response) => {
        setChats(response.data);
      })
      .catch((e: any) => {
        track("no data", e);
      });
  };

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
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getUserData();
    handleUserIds();
  }, [selected]);

  const validateEntries = () => {
    if (name === "" || userids === "") {
      return true;
    }
    return false;
  };

  const handleSearch = (search: string) => {
    setSearchedName(search);
    getChatsNames();
  };

  const handleJoin = (chat_id: any) => {
    socket.emit("join chat", {
      user_ids: state.authUserIdPk,
      chat_id: chat_id,
    });
    dispatch(setChatModal(1));
  };

  const handleUserIds = () => {
    const selectedUsers = selected.map(({ value }) => `${value}`).join(",");
    setUserids(selectedUsers);
  };

  const handleCreateChat = () => {
    socket.emit("start chat", {
      name: name,
      starter_id: state.authUserIdPk,
      user_ids: userids,
      is_private: false,
      is_bot: false,
    });
    toast({
      title: "Chat created",
      description: "Your chat has been created!",
    });
    track("Created chat", `${name}`);
    dispatch(setChatModal(1));
  };

  const handleCreateAIChat = (botName: any, botId: any, botType: string) => {
    socket.emit("start chat", {
      name: botName + " - " + state.authUserName,
      starter_id: botId,
      user_ids: state.authUserIdPk,
      is_private: true,
      is_bot: true,
    });
    toast({
      title: botName + " Chat activated",
      description: "Your AI chat has been activated!",
    });
    track("Activated AI chat", name);
    dispatch(setChatModal(1));
    if (botType === 'assist') {
      dispatch(setHasAssist(true));
    }
  };

  const openListModal = () => {
    dispatch(setChatModal(1));
  };

  return (
    <div>
      {state.hasAssist == false && (
        <>
          <h5>Activate AI Assistant!</h5>
          <div className="p-1">
            <Button
              className="m-2 border-red bg-sky-500"
              color="gray"
              onClick={() => handleCreateAIChat('assist', '515', 'assist')}
            >
              Activate
            </Button>
          </div>
        </>
      )}
      <h5>Join existing chat</h5>
      <SearchBox placeholder="Search chat names" doSearch={handleSearch} />
      <div>
        {chats.map((chat) => (
          <div key={chat.id} className="flex">
            <p>{chat.name}</p>
            <div className="px-4">
              <Button onClick={() => handleJoin(chat.id)}>Join</Button>
            </div>
          </div>
        ))}
      </div>
      <h5>Start new chat</h5>
      <Input
        className="my-1"
        name="name"
        value={name}
        placeholder="Name"
        autoCapitalize="none"
        onChange={(event) => setName(event.target.value)}
      />
      <div style={{ backgroundColor: "black", color: "purple" }}>
        <MultiSelect
          options={userData}
          value={selected}
          onChange={setSelected}
          labelledBy="Select"
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button
            className="m-2"
            onClick={() => handleCreateChat()}
            disabled={validateEntries()}
          >
            Create
          </Button>
        </div>
        <div className="p-1">
          <Button
            className="m-2 border-red bg-sky-500"
            color="gray"
            onClick={() => openListModal()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

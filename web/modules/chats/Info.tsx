import { Button } from "@/components/ui/button";
import { apixClient } from "@/clients/axios";
import { socket } from "@/clients/socket";
import { RootState } from "@/store";
import { setChatModal } from "@/store/slices/chat";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export const Info = () => {
  const chatState = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const [chat, setChat] = useState<any>("");
  const [participants, setParticipants] = useState<any[]>([]);

  const getChat = async () => {
    apixClient
      .get(`/chat/${chatState.activeId}`)
      .then((response) => {
        setChat(response.data);
        setParticipants(response.data.participants);
      })
      .catch((e) => {
        console.log("no data", e);
      });
  };

  React.useEffect(() => {
    getChat();
  }, []);

  const handleRemoveParticipant = (user_id: any) => {
    socket.emit("leave chat", {
      user_id: user_id,
      chat_id: chat.id,
    });
    getChat();
    dispatch(setChatModal(4));
  };

  const openNameUpdateModal = () => {
    dispatch(setChatModal(5));
  };

  const openPicUpdateModal = () => {
    dispatch(setChatModal(6));
  };

  const openAddParticipantsModal = () => {
    dispatch(setChatModal(7));
  };

  const openShowModal = () => {
    dispatch(setChatModal(3));
  };

  return (
    <div className="chats-body">
      <h5>Chat Information</h5>
      <p>{chat.name}</p>
      {/* {data?.me?.avatar ? (
        <img
          src={`${apixURL}/static/uploads/users/${data.me.avatar}`}
          height={100}
          width={100}
        />
      ) : null} */}
      <div className="flex">
        <div className="p-1">
          <Button onClick={(e) => openNameUpdateModal()}>
            Update Chat Name
          </Button>
        </div>
        <div className="p-1">
          <Button onClick={(e) => openPicUpdateModal()}>Update Picture</Button>
        </div>
      </div>
      <p>Participants</p>
      <div className="flex justify-center items-center md:mt-5">
        <div className="grid grid-cols-4 gap-2 max-w-md lg:grid-cols-4">
          {participants.map((participant: any) => (
            <div key={participant.id}>
              <p>{participant.username}</p>
              <button>
                <MdDelete
                  size={20}
                  onClick={() => {
                    handleRemoveParticipant(participant.id);
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={(e: any) => openAddParticipantsModal()}>
            Add Participants
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-1">
          <Button onClick={(e: any) => openShowModal()}>Close</Button>
        </div>
      </div>
    </div>
  );
};

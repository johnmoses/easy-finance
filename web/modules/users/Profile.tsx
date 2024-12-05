import { useAvatarUpdateMutation, useMeQueryQuery } from "@/gql/schemas";
import React, { ChangeEvent, useContext, useState } from "react";
import { Delete } from "./Delete";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import { apixClient } from "@/clients/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUserAvatar } from "@/store/slices/app";
import { useToast } from "@/components/ui/use-toast";
import { apixURL } from "@/clients/utils";
import { Update } from "./Update";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const Profile = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const { data } = useMeQueryQuery();
  const [file, setFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState("");
  const [avatarUpdate] = useAvatarUpdateMutation();
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  function toggleUpdateModal() {
    setUpdateModal(!updateModal);
  }

  function toggleDeleteModal() {
    setDeleteModal(!deleteModal);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
    if (selectedFile) {
      const fname = selectedFile.name;
      const userid = state.authUserIdPk as string;
      const utime = Math.floor(Date.now() / 1000).toString();
      const fext = fname.split(".").pop();
      const filename = userid + utime + "." + fext;
      setAvatar(filename);
    }
  };

  const handleUpdateAvatar = async () => {
    if (file) {
      avatarUpdate({
        variables: {
          avatar: avatar,
        },
      }).then(() => {
        dispatch(setUserAvatar(avatar));
        toast({
          title: "Profile Update",
          description: "You have updated your profile photo!",
        });
        setAvatar("");
        track("Updated user avatar", `Avatar: ${avatar}`);
      });
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", avatar);
        formData.append("destination", "users");
        // formData.append("userid", state.authUserIdPk);

        const response = await apixClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <h3>My Profile</h3>
      {/* {data?.me?.avatar ? (
        <img
          src={`${apixURL}/static/uploads/users/${data.me.avatar}`}
          height={100}
          width={100}
        />
      ) : null} */}
      <Avatar className="ml-2">
        <AvatarImage
          src={
            state.authUserAvatar
              ? `${apixURL}/static/uploads/users/${state.authUserAvatar}`
              : `${apixURL}/static/uploads/users/user.svg`
          }
        />
      </Avatar>
      <div>Username: {data?.me?.username}</div>
      <div>Email: {data?.me?.email}</div>
      <div>Mobile Number: {data?.me?.mobile}</div>
      <div>First Name{data?.me?.firstName}</div>
      <div>Last Name{data?.me?.lastName}</div>
      <div>
        <label>Profile Picture:</label>
        <div>
          <input
            id="file-input"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
          />
        </div>
        <p>Accepted file formats: .jpg, .jpeg, .png</p>
        <div className="p-2">
          <Button onClick={handleUpdateAvatar} disabled={!file}>
            Update Photo
          </Button>
        </div>
        <div>
          <div className="p-2">
            <Button onClick={toggleUpdateModal}>Update User Profile</Button>
          </div>
          <div className="p-2">
            <Button onClick={toggleDeleteModal}>Close Account</Button>
          </div>
        </div>
      </div>
      <Update node={data?.me} open={updateModal} onClose={toggleUpdateModal} />
      <Delete open={deleteModal} onClose={toggleDeleteModal} />
    </>
  );
};

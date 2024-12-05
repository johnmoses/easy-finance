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
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import {
  UserSelectDocument,
  useUserUpdateMutation,
} from "@/gql/schemas";
import React, { useContext, useState } from "react";

interface UpdateProps {
  node: any;
  last?: number;
  open: boolean;
  onClose: () => void;
}

export const Update = ({ node, last, open, onClose }: UpdateProps) => {
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [firstName, setFirstName] = useState(node?.firstName);
  const [lastName, setLastName] = useState(node?.lastName);
  const [gender, setGender] = useState(node?.gender);
  const [bio, setBio] = useState(node?.bio);
  const [address, setAddress] = useState(node?.address);
  const [worshipLocation, setWorshipLocation] = useState(node?.worshipLocation);
  const [ministry1, setMinistry1] = useState(node?.ministry1);
  const [ministry2, setMinistry2] = useState(node?.ministry2);
  const [ministry3, setMinistry3] = useState(node?.ministry3);
  const [message, setMessage] = useState("");
  const [userUpdate] = useUserUpdateMutation();

  const init = () => {
    setFirstName(node?.firstName);
    setLastName(node?.lastName);
    setGender(node?.gender);
    setBio(node?.bio);
    setAddress(node?.address);
    setWorshipLocation(node?.worshipLocation);
    setMinistry1(node?.ministry1);
    setMinistry2(node?.ministry2);
    setMinistry3(node?.ministry3);
  };

  React.useEffect(() => {
    init();
  }, [node]);

  const validateEntries = () => {
    if (firstName === undefined || lastName === undefined) {
      return true;
    }
    return false;
  };

  const handleUpdate = () => {
    userUpdate({
      variables: {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        bio: bio,
        address: address,
      },
      refetchQueries: [
        {
          query: UserSelectDocument,
          variables: {
            id: node.id,
            last: last,
          },
        },
      ],
    })
      .then(() => {
        setFirstName("");
        setLastName("");
        setGender("");
        setBio("");
        setAddress("");
        onClose();
        toast({
          title: "User updated",
          description: "You have updated a user",
        });
        track("Updated user", node.id);
      })
      .catch(() => {
        setMessage("Cannot add content this time!");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>{message}</div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="firstName" />
            </div>
            <Input
              id="firstName"
              value={firstName}
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="lastName" />
            </div>
            <Input
              id="lastName"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="gender" />
            </div>
            <Input
              id="gender"
              value={gender}
              placeholder="Gender"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bio" />
            </div>
            <Input
              id="bio"
              value={bio}
              placeholder="Biodata"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" />
            </div>
            <Input
              id="address"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
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

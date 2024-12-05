import { RootState } from "@/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CategoryModal } from "./CategoryModal";
import { ListModal } from "./ListModal";
import { ShowModal } from "./ShowModal";
import { setHelpBoxOpen } from "@/store/slices/help";
import { Button } from "@/components/ui/button";

const HelpBox = () => {
  const helpState = useSelector((state: RootState) => state.help);
  const dispatch = useDispatch();

  const closeHelpBox = () => {
    dispatch(setHelpBoxOpen(false));
  };

  return (
    <div className="border-none fixed z-50  bottom-10 border bg-black text-white rounded-full right-0 text-4xl outline-none ml-0 mr-3 md:mr-5">
      <div className="chatbox">
        <div
          className={
            helpState.helpBoxOpen === false
              ? "helpbox-modal-closed"
              : "helpbox-modal"
          }
        >
          <div className="helps">
            {helpState.helpModal === 0 && <CategoryModal />}
            {helpState.helpModal === 1 && <ListModal />}
            {helpState.helpModal === 2 && <ShowModal />}
            <Button onClick={closeHelpBox}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpBox;

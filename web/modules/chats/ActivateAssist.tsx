import { Button } from "@/components/ui/button";
import { setChatModal } from "@/store/slices/chat";
import React from "react";
import { useDispatch } from "react-redux";

export const ActivateAssist = () => {
    const dispatch = useDispatch();

    const goBack = () => {
        dispatch(setChatModal(0));
    };

    return (
        <>
            <div className="chats-body">
                <div className="flex flex-col h-screen justify-center items-center">

                    <h5>Activate Assistant</h5>
                    
                    <div className="p-1">
                        <Button
                            className="m-2 border-red bg-sky-500"
                            color="gray"
                            onClick={() => goBack()}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
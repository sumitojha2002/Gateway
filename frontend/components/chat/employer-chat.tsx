import React from "react";
import { LeftChatMemeber } from "./componenets-message/leftcharmemeber";
import { ChatMain } from "./componenets-message/chatmain";
import { getChats } from "@/lib/chatapi";

export function EmployerChat() {
  return (
    <div className=" h-190 gap-2 flex">
      <div className="w-1/3  h-full ">
        <LeftChatMemeber />
      </div>
      <div className="w-2/3 h-full">
        <ChatMain />
      </div>
    </div>
  );
}

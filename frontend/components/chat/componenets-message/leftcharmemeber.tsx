import React from "react";
import { MessageBackButton } from "./button/message-back-button";
import { getChats } from "@/lib/chatapi";
import { ChatList } from "./client-list";

export async function LeftChatMemeber() {
  const res = await getChats();
  const chats = res.data || [];
  //console.log(chats);

  return (
    <div className="h-full">
      <div className="mt-2">
        <MessageBackButton />
      </div>
      <div>
        <h1 className="text-2xl mt-7 font-semi-bold">Your Inbox</h1>
      </div>
      <ChatList initialChats={chats} />
    </div>
  );
}

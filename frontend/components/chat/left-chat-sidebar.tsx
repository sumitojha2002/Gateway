"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MessageBackButton } from "./componenets-message/button/message-back-button";
import { MessageHeaderCard } from "./messageheadercard";

interface ChatListItem {
  id: number;
  display_name: string;
  job_title: string;
  created_at: string;
  picture: string;
}

interface Props {
  initialChats: ChatListItem[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

export function LeftChatSidebar({
  initialChats,
  selectedChatId,
  onSelectChat,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = initialChats.filter(
    (item) =>
      item.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.job_title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //console.log(filteredChats);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="mb-3 md:mb-4">
          <MessageBackButton />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Your Inbox
        </h1>
      </div>

      {/* Search */}
      <div className="p-3 md:p-4">
        <Input
          className="border-[#4A70A9] rounded-md text-base"
          placeholder="Search candidate..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ?
          <div className="text-center text-gray-500 py-8 px-4 text-sm md:text-base">
            {searchQuery ? "No results found" : "No conversations yet"}
          </div>
        : filteredChats.map((item) => (
            <div
              key={item.id}
              className={`mb-1 ${
                selectedChatId === item.id ?
                  "bg-blue-50 border-l-4 border-l-blue-500"
                : ""
              }`}
            >
              <MessageHeaderCard
                displayname={item.display_name}
                jobtitle={item.job_title}
                createdat={item.created_at}
                chatId={item.id}
                isSelected={selectedChatId === item.id}
                picture={item.picture}
                onSelect={() => onSelectChat(item.id)}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}

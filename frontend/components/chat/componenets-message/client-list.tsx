"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { MessageHeaderCard } from "../messageheadercard";

interface ChatListItem {
  id: number;
  display_name: string;
  job_title: string;
  created_at: string;
  picture: string;
}

interface Props {
  initialChats: ChatListItem[];
}

export function ChatList({ initialChats }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(initialChats);
  const filteredChats = initialChats.filter(
    (item) =>
      item.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.job_title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div>
        <Input
          className="border-[#4A70A9] p-4 mt-7 mb-5 rounded-md"
          placeholder="Search candidate..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredChats.length === 0 ?
        <div className="text-center text-gray-500 py-8">
          {searchQuery ? "No results found" : "No conversations yet"}
        </div>
      : filteredChats.map((item) => (
          <div key={item.id} className="mb-3">
            <MessageHeaderCard
              chatId={item.id}
              displayname={item.display_name}
              jobtitle={item.job_title}
              createdat={item.created_at}
              picture={item.picture}
            />
          </div>
        ))
      }
    </>
  );
}

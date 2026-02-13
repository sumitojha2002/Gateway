"use client";

import { useState } from "react";
import { LeftChatSidebar } from "./left-chat-sidebar";
import { ChatWindow } from "./chat-window";

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

export function ChatLayout({ initialChats }: Props) {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  //console.log("Intial", initialChats);

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    // On mobile, hide sidebar after selecting a chat
    setShowMobileSidebar(false);
  };

  const handleShowSidebar = () => {
    setShowMobileSidebar(true);
  };

  return (
    <>
      {/* Mobile Overlay - Fixed to viewport, not container */}
      {showMobileSidebar && selectedChatId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Main Chat Container */}
      <div className="flex h-screen md:h-[calc(100vh-1.75rem)] overflow-hidden -mx-4 md:mx-0 md:mt-7">
        {/* Left Sidebar - Chat List */}
        <div
          className={`
            w-full md:w-96 
            border-r border-gray-200 bg-white
            fixed md:relative z-50 md:z-auto h-full
            transition-transform duration-300 ease-in-out
            mt-10
            ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <LeftChatSidebar
            initialChats={initialChats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 w-full md:w-auto mt-10">
          {selectedChatId ?
            <ChatWindow
              chatId={selectedChatId}
              initialChats={initialChats}
              onShowSidebar={handleShowSidebar}
            />
          : <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
              <svg
                className="w-16 h-16 md:w-24 md:h-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-base md:text-lg font-medium text-center">
                Select a conversation to start messaging
              </p>
            </div>
          }
        </div>
      </div>
    </>
  );
}

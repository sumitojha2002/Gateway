"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Volk from "@/public/user_profile.jpg";
import { URLS } from "@/constants";

// ── Types ────────────────────────────────────────────────────────────────────

/** Shape of each item returned by the REST API */
interface ApiMessage {
  id: number;
  sender_name: string;
  message: string;
  is_sender: boolean;
  timestamp: string;
  room: number;
  sender: number;
}

/** Paginated REST response shape */
interface MessagesResponse {
  next: string | null;
  previous: string | null;
  results: ApiMessage[];
}

/** Internal message shape used throughout the component */
interface Message {
  id: number;
  chat?: number;
  sender: number;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  is_sender: boolean;
  timestamp: string;
  is_read: boolean;
  // Add a temporary ID field for optimistic updates
  tempId?: string;
}

interface ChatListItem {
  id: number;
  display_name: string;
  job_title: string;
  created_at: string;
  picture: string;
}

interface Props {
  initialChats: ChatListItem[];
  chatId: number;
  onShowSidebar?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatWindow({ chatId, initialChats, onShowSidebar }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [otherUserStatus, setOtherUserStatus] = useState<"online" | "offline">(
    "offline",
  );
  const picture = initialChats.find((item) => item.id === chatId)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Normalise session user id (NextAuth string) to number to match API sender (number)
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : -1;

  // ── Map API message → internal Message ──────────────────────────────────────
  const mapApiMessage = (msg: ApiMessage): Message => ({
    id: msg.id,
    chat: msg.room,
    sender: msg.sender,
    sender_name: msg.sender_name,
    content: msg.message,
    is_sender: msg.is_sender,
    timestamp: msg.timestamp,
    is_read: false,
  });

  // ── Load initial messages ────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      console.log("loadMessage", json);
      // Proxy wraps the Django response: { status, message, data: { next, results } }
      const data: MessagesResponse = json.data ?? json;

      // API returns newest-first → reverse for oldest-first display
      const mapped = (data.results ?? []).map(mapApiMessage).reverse();

      setMessages(mapped);
      setNextCursor(data.next); // save cursor for "load more"
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // ── Load older messages (pagination) ────────────────────────────────────────
  const loadMoreMessages = async () => {
    if (!nextCursor || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetch(nextCursor);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: MessagesResponse = await response.json();
      const older = (data.results ?? []).map(mapApiMessage).reverse();

      // Prepend older messages, keeping scroll position stable
      setMessages((prev) => [...older, ...prev]);
      setNextCursor(data.next);
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Reset + reload when chatId changes ──────────────────────────────────────
  useEffect(() => {
    setMessages([]);
    setMessageInput("");
    setIsConnected(false);
    setConnectionError("");
    setNextCursor(null);
    setOtherUserStatus("offline");
    loadMessages();
  }, [chatId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── WebSocket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user?.accessToken) {
      setConnectionError("Not authenticated");
      return;
    }

    // Close previous socket before opening a new one
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    const wsUrl = URLS.WS_CHAT(chatId);
    const fullUrl = `${wsUrl}?token=${session.user.accessToken}`;
    const ws = new WebSocket(fullUrl);
    socketRef.current = ws;
    console.log(ws);
    ws.onopen = (event) => {
      console.log("wsOpen:", event);
      setIsConnected(true);
      setConnectionError("");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("wsData", data);

        // Handle presence updates
        if (data.type === "presence") {
          // Only update status if it's not our own user ID
          if (data.user_id !== currentUserId) {
            setOtherUserStatus(data.status === "online" ? "online" : "offline");
          }
          return;
        }

        // Validate message has required fields and content is not empty
        if (
          !data.content ||
          typeof data.content !== "string" ||
          !data.content.trim()
        ) {
          console.warn("Received empty or invalid message, skipping:", data);
          return;
        }

        // Skip the server echo of our own messages —
        // we already added them via optimistic update
        if (data.is_sender === true) {
          // If server returns a real ID for our optimistic message, update it
          setMessages((prev) =>
            prev.map((msg) => {
              // Match by content and timestamp (within 5 seconds) for optimistic messages
              if (
                msg.tempId &&
                msg.content === data.content &&
                Math.abs(
                  new Date(msg.timestamp).getTime() -
                    new Date(data.created_at).getTime(),
                ) < 5000
              ) {
                return {
                  ...msg,
                  id: data.id,
                  tempId: undefined,
                };
              }
              return msg;
            }),
          );
          return;
        }

        // Additional validation for required fields
        if (!data.sender_id && !data.sender) {
          console.warn("Message missing sender ID, skipping:", data);
          return;
        }

        const newMessage: Message = {
          id: data.id ?? Date.now(),
          sender: data.sender_id ?? data.sender,
          sender_name: data.sender_name || "Unknown",
          content: data.content.trim(),
          is_sender: false,
          timestamp: data.created_at ?? new Date().toISOString(),
          is_read: data.status === "read",
        };

        // Deduplicate: only add if message with this ID doesn't already exist
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      setOtherUserStatus("offline");
      if (event.code === 1006) {
        setConnectionError("Connection failed — check server status");
      } else if (event.code === 1008) {
        setConnectionError("Authentication failed");
      } else {
        setConnectionError("Disconnected");
      }
    };

    ws.onerror = () => setConnectionError("Connection error");

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [chatId, session, currentUserId]);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();

    // Validate message content
    if (!trimmed || trimmed.length === 0) {
      setMessageInput(""); // Clear empty input
      return;
    }

    // Hard-check socket readyState — don't rely on isConnected state alone
    // since it can be stale in closures (e.g. after tab switch)
    const socketReady = socketRef.current?.readyState === WebSocket.OPEN;

    if (!socketReady) {
      // If disconnected, clear any lingering input so it can't be sent later
      setMessageInput("");
      return;
    }

    // Additional validation: prevent sending messages that are too long (optional)
    if (trimmed.length > 5000) {
      console.warn("Message too long, max 5000 characters");
      return;
    }

    socketRef.current!.send(
      JSON.stringify({ type: "message", content: trimmed }),
    );

    // Optimistic update with temporary ID
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const timestamp = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), // This will be replaced when server confirms
        tempId, // Track this is an optimistic message
        chat: chatId,
        sender: currentUserId,
        sender_name: "You",
        content: trimmed,
        is_sender: true,
        timestamp,
        is_read: false,
      } satisfies Message,
    ]);

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full md:h-200">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 flex items-center gap-3">
        {/* Menu button for mobile to show sidebar */}
        {onShowSidebar && (
          <button
            onClick={onShowSidebar}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Show conversations"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src={picture.picture || Volk}
            alt="User"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">
            {picture.display_name}
          </h2>
          <p className="text-sm">
            {isConnected ?
              otherUserStatus === "online" ?
                <span className="text-green-500">● Online</span>
              : <span className="text-gray-500">● Offline</span>
            : <span className="text-red-500">
                ● {connectionError || "Disconnected"}
              </span>
            }
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        {loading ?
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        : messages.length === 0 ?
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
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
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        : <div className="space-y-4">
            {/* Load more button */}
            {nextCursor && (
              <div className="flex justify-center" ref={messagesTopRef}>
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50 py-1 px-3 rounded-full border border-blue-200 hover:border-blue-400 transition-colors"
                >
                  {loadingMore ? "Loading..." : "Load older messages"}
                </button>
              </div>
            )}

            {messages
              .filter((msg) => msg.content && msg.content.trim().length > 0) // Filter empty messages
              .map((msg) => {
                const isSent = msg.is_sender;
                return (
                  <div
                    key={msg.tempId || msg.id}
                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  >
                    {!isSent && (
                      <div className="relative h-8 w-8 mr-2 flex-shrink-0">
                        <Image
                          src={picture.picture || Volk}
                          alt={msg.sender_name || "User"}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-md px-4 py-2 rounded-lg ${
                        isSent ?
                          "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-900 shadow-sm rounded-bl-none"
                      } ${msg.tempId ? "opacity-70" : "opacity-100"}`}
                    >
                      {/* {!isSent && msg.sender_name && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {msg.sender_name}
                        </p>
                      )} */}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isSent ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatTime(msg.timestamp)}
                        {msg.tempId && " • Sending..."}
                      </p>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>
        }
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-3 md:p-4 safe-area-bottom">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1 text-base"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 px-4 md:px-6"
          >
            <span className="hidden sm:inline">Send</span>
            <svg
              className="w-5 h-5 sm:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            {connectionError || "Disconnected. Trying to reconnect..."}
          </p>
        )}
      </div>
    </div>
  );
}

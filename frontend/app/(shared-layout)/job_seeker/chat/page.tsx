import { getChats } from "@/lib/chatapi";
import { ChatLayout } from "@/components/chat/chat-layout";

export default async function ChatPage() {
  const res = await getChats();
  const chats = res.data || [];

  return <ChatLayout initialChats={chats} />;
}

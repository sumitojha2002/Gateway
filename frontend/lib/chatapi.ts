import { URLS } from "@/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export interface Chat {
  id: number;
  job_application: number;
  employer: {
    id: number;
    name: string;
    avatar?: string;
  };
  job_seeker: {
    id: number;
    name: string;
    avatar?: string;
  };
  last_message?: {
    content: string;
    timestamp: string;
    sender_id: number;
  };
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  chat: number;
  sender: number;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

interface Data {
  id: number;
  display_name: string;
  job_title: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: Data[];
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ========================================
// HELPER FUNCTION
// ========================================

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get token from localStorage, cookies, or your auth state
  const session = await getServerSession(authOptions);

  const token = session?.user.accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ========================================
// CHAT API FUNCTIONS
// ========================================

/**
 * Initiate a new chat for a job application
 * POST /api/chat/chat-initiate/
 */

/**
 * Get all chats for the current user
 * GET /api/chat/chats/
 * Supports pagination with cursor and search
 */
export async function getChats(params?: {
  cursor?: string;
  search?: string;
}): Promise<PaginatedResponse<Chat>> {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.search) queryParams.append("search", params.search);

  const url = `${URLS.GET_CHATS}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  return fetchWithAuth(url);
}

/**
 * Get details of a specific chat
 * GET /api/chat/chats/{id}/
 */
export async function getChatDetail(chatId: number | string): Promise<Chat> {
  return fetchWithAuth(URLS.GET_CHAT_DETAIL(chatId));
}

/**
 * Get messages for a specific chat
 * GET /api/chat/chat/{id}/messages/
 * Supports pagination with cursor and search
 */
export async function getChatMessages(
  chatId: number | string,
  params?: {
    cursor?: string;
    search?: string;
  },
): Promise<PaginatedResponse<Message>> {
  const queryParams = new URLSearchParams();
  if (params?.cursor) queryParams.append("cursor", params.cursor);
  if (params?.search) queryParams.append("search", params.search);

  const url = `${URLS.GET_CHAT_MESSAGES(chatId)}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  return fetchWithAuth(url);
}

// ========================================
// WEBSOCKET HELPER
// ========================================

/**
 * Create a WebSocket connection for a chat
 * WS /ws/chat/{id}/
 */
export function createChatWebSocket(
  chatId: number | string,
  token?: string,
): WebSocket {
  const wsToken = token;
  const wsUrl = URLS.WS_CHAT(chatId);

  return new WebSocket(`${wsUrl}?token=${wsToken}`);
}

// ========================================
// EXAMPLE USAGE
// ========================================

/*

// 1. Initiate a chat when employer clicks on an applicant
const chat = await initiateChat(jobApplicationId);

// 2. Get all chats for the user
const { results: chats } = await getChats();

// 3. Search chats
const { results: searchResults } = await getChats({ search: 'John' });

// 4. Load chat messages
const { results: messages } = await getChatMessages(chatId);

// 5. Connect to WebSocket for real-time updates
const ws = createChatWebSocket(chatId);

ws.onopen = () => {
  //console.log('Connected to chat');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  //console.log('New message:', message);
};

ws.send(JSON.stringify({
  message: 'Hello!',
  timestamp: new Date().toISOString()
}));

*/

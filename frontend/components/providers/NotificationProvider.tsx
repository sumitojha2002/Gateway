import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";
import { NotificationWrapper } from "./NotificationWrapper";

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  user: number;
}

interface NotificationResponse {
  data: NotificationItem[];
  count?: number;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export async function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const session = await getServerSession(authOptions);
  let notifications: NotificationItem[] = [];

  // Only fetch if user is authenticated
  if (session?.user?.accessToken) {
    try {
      const response = await fetcher<NotificationResponse>(
        URLS.GET_NOTIFICATION,
      );
      notifications = response.data || [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      notifications = [];
    }
  }

  return (
    <NotificationWrapper initialNotifications={notifications}>
      {children}
    </NotificationWrapper>
  );
}

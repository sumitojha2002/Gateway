"use client";

import { useEffect } from "react";
import { setNotifications } from "@/app/features/notificationSlice";
import { useGetNotificationsQuery } from "@/lib/api";
import { useAppDispatch } from "@/hooks/hooks";

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  user: number;
}

interface NotificationProviderProps {
  children: React.ReactNode; // ← removed initialNotifications
}

const POLL_INTERVAL = 60_000;

export function NotificationProvider({ children }: NotificationProviderProps) {
  const dispatch = useAppDispatch();

  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data));
    }
  }, [data, dispatch]);

  return <>{children}</>;
}

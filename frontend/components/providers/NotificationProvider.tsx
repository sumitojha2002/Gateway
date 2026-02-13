"use client";

import { useEffect, useRef } from "react";

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
  initialNotifications: NotificationItem[];
  children: React.ReactNode;
}

const POLL_INTERVAL = 60_000;

export function NotificationProvider({ initialNotifications, children }: NotificationProviderProps) {
  const dispatch = useAppDispatch();
  const seeded = useRef(false);

  // Seed Redux with server-fetched data on first render
  if (!seeded.current) {
    dispatch(setNotifications(initialNotifications));
    seeded.current = true;
  }

  // RTK Query handles auth + polling — no manual fetch needed
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
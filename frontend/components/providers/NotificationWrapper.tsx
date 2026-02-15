"use client";

import { useEffect } from "react";
import { setNotifications } from "@/app/features/notificationSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { NotificationItem } from "./NotificationProvider";

interface NotificationWrapperProps {
  children: React.ReactNode;
  initialNotifications: NotificationItem[];
}

export function NotificationWrapper({
  children,
  initialNotifications,
}: NotificationWrapperProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set initial notifications from server
    dispatch(setNotifications(initialNotifications));
  }, [initialNotifications, dispatch]);

  return <>{children}</>;
}

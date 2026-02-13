"use client";

import React from "react";
import { Bell, BellOff, Briefcase, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

import { markAsRead, markAllAsRead } from "@/app/features/notificationSlice";
import { useMarkAsReadMutation } from "@/lib/api";
import type { NotificationItem } from "@/components/providers/NotificationProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

function timeAgo(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

function NotificationCard({
  notification,
}: {
  notification: NotificationItem;
}) {
  const dispatch = useAppDispatch();
  const [markAsReadApi] = useMarkAsReadMutation();

  const handleClick = async () => {
    if (notification.is_read) return;

    // Optimistic update — update UI immediately
    dispatch(markAsRead(notification.id));

    try {
      await markAsReadApi({ id: notification.id, stat: true }).unwrap();
    } catch (e) {
      // Rollback if API fails
      dispatch(markAsRead(notification.id)); // you may want a markAsUnread action for proper rollback
      console.error("Failed to mark notification as read:", e);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer",
        notification.is_read ?
          "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
        : "bg-blue-50/60 border-blue-100 hover:border-blue-200 hover:shadow-sm shadow-sm",
      )}
    >
      {/* Unread dot */}
      {!notification.is_read && (
        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#4A70A9]" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          notification.is_read ? "bg-gray-100" : "bg-[#4A70A9]/10",
        )}
      >
        <Briefcase
          size={16}
          className={notification.is_read ? "text-gray-400" : "text-[#4A70A9]"}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-snug",
            notification.is_read ?
              "text-gray-600 font-normal"
            : "text-gray-900 font-semibold",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 text-sm text-gray-500 leading-snug">
          {notification.body}
        </p>
        <p className="mt-1.5 text-xs text-gray-400">
          {timeAgo(notification.created_at)}
        </p>
      </div>
    </div>
  );
}

export function Notification() {
  const dispatch = useAppDispatch();
  const [markAsReadApi] = useMarkAsReadMutation();
  const notifications = useAppSelector(
    (state) => state.notifications.items as NotificationItem[],
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const hasNotifications = notifications.length > 0;

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    // Optimistic update
    dispatch(markAllAsRead());

    // Fire all PATCH requests in parallel
    await Promise.allSettled(
      unread.map((n) => markAsReadApi({ id: n.id, stat: true })),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A70A9]/10">
              <Bell size={18} className="text-[#4A70A9]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#4A70A9] hover:bg-[#4A70A9]/8 transition-colors"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {hasNotifications ?
          <div className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        : <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <BellOff size={22} className="text-gray-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-gray-700">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-gray-400">
              You&apos;ll be notified when something happens.
            </p>
          </div>
        }
      </div>
    </div>
  );
}

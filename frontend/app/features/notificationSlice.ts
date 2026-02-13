import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NotificationItem } from "@/components/providers/NotificationProvider";

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
    },
    markAsRead(state, action: PayloadAction<number>) {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification) {
        notification.is_read = true;
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.is_read = true;
      });
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;

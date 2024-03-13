"use client";

import SidebarAdmin from "@/src/components/admin/SidebarAdmin";
import React from "react";
import { getAllNotification } from "@/src/redux/features/notificationSlice";
import { useAppDispatch } from "@/src/redux/store";
import { socketInstance } from "@/src/utils/socket/socket-provider";

const AdminLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  const dispatch = useAppDispatch();

  //handle notification
  const [dataNotification, setDataNotification] = React.useState<
    any | undefined
  >();

  const [newNotificationQuantity, setNewNotificationQuantity] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    dispatch(getAllNotification()).then((result) => {
      socketInstance.on("getNotifications-admin@gmail.com", (data: any) => {
        console.log("data", data);
        setNewNotificationQuantity(data.total_notifications);
        setDataNotification(data.notifications);
      });
    });
  }, []);

  return (
    <div className="flex layout-admin h-screen">
      <SidebarAdmin newNotificationQuantity={newNotificationQuantity} />

      <div
        className="main flex-1 overflow-x-hidden overflow-y-scroll pl-4"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default AdminLayout;

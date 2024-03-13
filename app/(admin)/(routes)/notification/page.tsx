"use client";

import { socketInstance } from "@/src/utils/socket/socket-provider";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationType } from "@/src/types/notification.type";
import {
  getAllNotification,
  updateAllNotification,
} from "@/src/redux/features/notificationSlice";
import { Check, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationItems from "@/src/components/shared/_components/Notification/NotificationItems";

const Notification = () => {
  const dispatch = useAppDispatch();
  const { loadingNotification } = useAppSelector((state) => state.notification);

  const handleReadAllNotification = () => {
    dispatch(updateAllNotification()).then((result) => {
      setDataNotification(result.payload);
      setNewNotificationQuantity(0);
    });
  };

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
        console.log("data", data)
        setNewNotificationQuantity(data.total_notifications);
        setDataNotification(data.notifications);
        console.log("admin", data.notifications)
      });
    });
  }, []);

  if (loadingNotification) {
    return (
      <div className="px-2 py-2">
        <div className="flex justify-between items-center mb-2">
          <h2>Thông báo</h2>
          {/* <SocketIndicator /> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-auto w-auto p-2" variant={"ghost"}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="px-0 pt-3 pb-3 bg-white"
              side="bottom"
              align="start"
              style={{ borderRadius: "7px" }}
            >
              <Button
                className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                variant={"ghost"}
                onClick={handleReadAllNotification}
              >
                <Check className="w-4 h-4 mr-2" />
                Đánh dấu tất cả là đã đọc
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-20"></Skeleton>
          <Skeleton className="w-full h-20"></Skeleton>
          <Skeleton className="w-full h-20"></Skeleton>
          <Skeleton className="w-full h-20"></Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2>Thông báo</h2>
        {/* <SocketIndicator /> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-auto w-auto p-2" variant={"ghost"}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="px-0 pt-3 pb-3 bg-white"
            side="bottom"
            align="start"
            style={{ borderRadius: "7px" }}
          >
            <Button
              className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
              variant={"ghost"}
              onClick={handleReadAllNotification}
            >
              <Check className="w-4 h-4 mr-2" />
              Đánh dấu tất cả là đã đọc
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {Array.isArray(dataNotification) && dataNotification.length > 0 ? (
        <div className="flex flex-col gap-2 h-[480px]">
          {dataNotification?.map((item: any, index: number) => (
            <NotificationItems key={index} data={item} />
          ))}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center">
            <img
              className="w-28"
              src="https://www.facebook.com/images/comet/empty_states_icons/notifications/null_states_notifications_dark_mode.svg"
              alt="noti"
            ></img>
          </div>
          <p className="text-center">Bạn hiện không có thông báo nào cả.</p>
        </div>
      )}
    </div>
  );
};

export default Notification;

import React from "react";
import NotificationItems from "./NotificationItems";
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

interface NotificationListProps {
  dataNotification: any;
  setDataNotification: React.Dispatch<React.SetStateAction<any[]>>;
  setNewNotificationQuantity: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

const NotificationList: React.FC<NotificationListProps> = ({
  dataNotification,
  setDataNotification,
  setNewNotificationQuantity,
}) => {
  const { loadingNotification } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handleReadAllNotification = () => {
    dispatch(updateAllNotification()).then((result) => {
      setDataNotification(result.payload);
      setNewNotificationQuantity(0);
    });
  };

  if (loadingNotification) {
    return (
      <div className="px-2 py-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[368px] h-20"></Skeleton>
          <Skeleton className="w-[368px] h-20"></Skeleton>
          <Skeleton className="w-[368px] h-20"></Skeleton>
          <Skeleton className="w-[368px] h-20"></Skeleton>
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
        <div className="flex flex-col gap-2 h-[480px] pt-1 overflow-y-scroll">
          {dataNotification?.map((item: any, index: number) => (
            <NotificationItems key={index} data={item} />
          ))}
        </div>
      ) : (
        <div className="w-[368px]">
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

export default NotificationList;

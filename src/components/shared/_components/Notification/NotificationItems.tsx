"use client";

import { updateSelectedNotification } from "@/src/redux/features/notificationSlice";
import { useAppDispatch } from "@/src/redux/store";
import { getDateTimeDifference } from "@/src/utils/handleFunction";
import Link from "next/link";
import React from "react";

interface NotificationItemsProps {
  data: any;
}

const NotificationItems: React.FC<NotificationItemsProps> = ({ data }) => {
  console.log(data);
  const [navigateToLink, setNavigateToLink] = React.useState<string>("");
  const dispatch = useAppDispatch();

  const handleClickMarkReadNotification = () => {
    dispatch(updateSelectedNotification(data.id)).then((result) => {
      console.log(result);
    });
  };

  React.useEffect(() => {
    const typeToLinkMapping: Record<string, string> = {
      CREATE_PROJECT: "/manage-project",
      CONFIRM_PROJECT: "/business-board",
      UPDATE_PROJECT: "/business-board",
      INVITE_GROUP: "/group",
      REPLY_INVITE_MEMBER: "/group",
      REGISTER_PITCHING_BUSINESS: "/business-board",
      INVITE_LECTURER: "/lecturer-board",
      REPLY_INVITE_LECTURER: "/#",
      SELECTED_REGISTER_PITCHING: "/student-board",
      REJECTED_REGISTER_PITCHING: "/student-board",
      DONE_PHASE_BUSINESS: `/project/${data.note}/view`,
      DONE_PHASE_LECTURER: `/project/${data.note}/view`,
      POST_EVIDENCE_BUSINESS: `/#`,
      DONE_PROJECT_BUSINESS: `/project/${data.note}/view`,
      DONE_PROJECT_STUDENT: `/project/${data.note}/view`,
    };

    setNavigateToLink(typeToLinkMapping[data.notification_type] || "");
  }, [data]);

  return (
    <Link href={navigateToLink} onClick={handleClickMarkReadNotification}>
      <div
        className={`relative cursor-pointer border rounded-xl ${
          data.is_new && "border-orange-500"
        } hover:bg-gray-200 hover:rounded-xl`}
      >
        {data.is_new && (
          <button className="absolute -top-1 p-1 bg-orange-300 border border-orange-300 rounded-full"></button>
        )}

        <div className="flex items-center p-4">
          <img
            className="object-cover w-12 h-12 rounded-full border"
            src={
              data?.sender.avatar_url
                ? data?.sender.avatar_url
                : "data:image/png;base64,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"
            }
            alt="ava"
          />

          <div className="ml-3 w-80">
            <p
              className={`h-full w-full text-sm  ${
                data.is_new ? "text-black" : "text-gray-500"
              }`}
            >
              {data.information}
            </p>
            <p
              className={`text-xs  ${
                data.is_new ? "text-black" : "text-gray-500"
              }`}
            >
              {getDateTimeDifference(data.createdAt)} trước
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationItems;

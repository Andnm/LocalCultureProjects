"use client";

import Link from "next/link";
import React from "react";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllGroupAreMembers } from "@/src/redux/features/groupSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupType } from "@/src/types/group.type";
import { UserGroupType } from "@/src/types/user-group.type";
import {
  formatDate,
  getRelationshipStatusInfo,
} from "@/src/utils/handleFunction";
import { AlertDialogCreateGroupAndInviteMember } from "@/components/alert-dialog/AlertDialogCreateGroupAndInviteMember";

interface StatusInfo {
  color: string;
  text: string;
}

const GroupPage = () => {
  const dispatch = useAppDispatch();

  const [groupList, setGroupList] = React.useState<UserGroupType[]>([]);

  const { loadingGroup, loadingListGroup }: any = useAppSelector(
    (state) => state.group
  );

  const getGroupStatusInfo = (status: string): StatusInfo => {
    switch (status) {
      case "Active":
        return { color: "orange", text: "Nhóm đang hoạt động" };
      case "Free":
        return { color: "green", text: "Nhóm đang rảnh" };
      case "Inactive":
        return { color: "gray", text: "Nhóm không còn hoạt động" };
      default:
        return { color: "black", text: "Trạng thái không xác định" };
    }
  };

  React.useEffect(() => {
    dispatch(getAllGroupAreMembers()).then((result) => {
      if (getAllGroupAreMembers.fulfilled.match(result)) {
        const groupList = result.payload;
        const reversedGroupList = groupList.slice().reverse();
        setGroupList(reversedGroupList);
        console.log(result.payload);
      }
    });
  }, []);

  if (loadingListGroup) {
    return (
      <div className="py-10 px-4 container">
        <div className="flex justify-start item-start space-y-2 flex-col">
          <h1 className="text-2xl dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-800">
            Quản lý nhóm
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-2xl dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Quản lý nhóm
        </h1>

        <AlertDialogCreateGroupAndInviteMember
          groupList={groupList}
          setGroupList={setGroupList}
        >
          <div className="w-40 cursor-pointer flex items-center justify-center px-8 py-3 text-sm leading-6 font-medium rounded-md text-purple-700 dark:text-purple-700 bg-purple-100 hover:bg-purple-50 hover:text-purple-900 focus:ring ring-offset-2 ring-purple-100 focus:outline-none transition duration-150 ease-in-out">
            Tạo nhóm mới
          </div>
        </AlertDialogCreateGroupAndInviteMember>
      </div>

      {Array.isArray(groupList) && groupList.length > 0 ? (
        <div className="mt-8 grid grid-cols-3 justify-center items-stretch w-full gap-4">
          {groupList.map((group, index) => (
            <Link
              key={index}
              href={`/group/${group.group.id}/member`}
              className="booking-item mb-5 hover:shadow-xl transition duration-150 ease-in-out"
            >
              <div className="card-booking">
                <div className="main flex flex-col justify-between gap-3">
                  <div className="header">
                    <p>{group.group?.group_name}</p>
                  </div>

                  <div className="body flex gap-3">
                    <div className="content">
                      <p>
                        Ngày tạo: {formatDate(group.group?.createdAt ?? "")}
                      </p>
                      <p>Số lượng: {group.group?.group_quantity || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="circle"
                    style={{
                      backgroundColor: getRelationshipStatusInfo(
                        group?.relationship_status
                      ).color,
                    }}
                  ></div>
                  <p
                    className="text-sm"
                    style={{
                      color: getRelationshipStatusInfo(
                        group?.relationship_status
                      ).color,
                    }}
                  >
                    {getRelationshipStatusInfo(group?.relationship_status).text}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="circle"
                    style={{
                      backgroundColor: getGroupStatusInfo(
                        group?.group?.group_status
                      ).color,
                    }}
                  ></div>
                  <p
                    className="text-sm"
                    style={{
                      color: getGroupStatusInfo(group?.group?.group_status)
                        .color,
                    }}
                  >
                    {getGroupStatusInfo(group?.group?.group_status).text}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-neutral-700">
          Bạn chưa tham gia nhóm nào cả.
        </div>
      )}
    </div>
  );
};

export default GroupPage;

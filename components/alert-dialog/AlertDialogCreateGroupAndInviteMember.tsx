"use client";

import React from "react";

import { Typography } from "@material-tailwind/react";

import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { formatDate, generateFallbackAvatar } from "@/src/utils/handleFunction";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  createGroup,
  inviteMemberByLeader,
} from "@/src/redux/features/groupSlice";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { searchUserByEmail } from "@/src/redux/features/userSlice";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { useUserLogin } from "@/src/hook/useUserLogin";

interface DialogViewProjectProps {
  children: React.ReactNode;
  groupList: any;
  setGroupList: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AlertDialogCreateGroupAndInviteMember: React.FC<
  DialogViewProjectProps
> = ({ children, groupList, setGroupList }) => {
  const [open, setOpen] = React.useState(false);

  const [groupName, setGroupName] = React.useState<string>("");

  const [newMember, setNewMember] = React.useState<string>("");
  const [loadingSearchResult, setLoadingSearchResult] = React.useState(false);
  const [memberResultSearch, setMemberResultSearch] = React.useState<any[]>([]);
  const [memberList, setMemberList] = React.useState<any[]>([]);

  const [userLogin, setUserLogin] = useUserLogin();

  const [
    loadingHandleInviteAndCreateGroup,
    setLoadingHandleInviteAndCreateGroup,
  ] = React.useState(false);
  const dispatch = useAppDispatch();
  const { loadingGroup, error }: any = useAppSelector((state) => state.group);

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleNewMemberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingSearchResult(true);
    setNewMember(event.target.value);
    dispatch(
      searchUserByEmail({
        roleName: "Student",
        searchEmail: event.target.value,
      })
    ).then((result) => {
      setMemberResultSearch(result.payload);
      setLoadingSearchResult(false);
    });
  };

  const handleClickSelectMember = (selectedMember: any) => {
    setMemberList((prevMembers) => [...prevMembers, selectedMember]);
    setNewMember("");
    setMemberResultSearch([]);
  };

  const removeSelectedUserFromMemberList = (selectedMember: any) => {
    setMemberList((prevMembers) =>
      prevMembers.filter((member) => member !== selectedMember)
    );
  };

  const handleCreateNewGroupAndInviteMember = () => {
    const group_name = groupName;
    setLoadingHandleInviteAndCreateGroup(true);

    dispatch(createGroup(group_name))
      .then((result) => {
        if (createGroup.fulfilled.match(result)) {
          const newGroup = result.payload;
          setGroupList((prevGroupList) => [newGroup, ...prevGroupList]);

          const groupId = newGroup.group.id;

          if (memberList.length !== 0) {
            for (const user of memberList) {
              const data = {
                groupId: groupId,
                userEmail: user.email,
              };

              dispatch(inviteMemberByLeader(data)).then((res) => {
                if (inviteMemberByLeader.rejected.match(res)) {
                  toast.error(`${res.payload}`);
                  // console.log(res.payload);
                } else {
                  // console.log(res.payload);
                  toast.success(`Mời ${user.email} thành công!`);

                  const dataBodyNoti = {
                    notification_type: NOTIFICATION_TYPE.INVITE_GROUP,
                    information: `${userLogin?.fullname} đã gửi lời mời bạn tham gia group ${groupName}`,
                    sender_email: `${userLogin?.email}`,
                    receiver_email: `${user.email}`,
                  };

                  dispatch(createNewNotification(dataBodyNoti)).then(
                    (resNoti) => {
                      console.log(resNoti);
                    }
                  );
                }
              });
            }
          }
          toast.success("Tạo nhóm thành công!");
          setOpen(false);
          setLoadingHandleInviteAndCreateGroup(false);
        } else if (createGroup.rejected.match(result)) {
          // console.log(result.payload);
          toast.error(`${result.payload}`);
          setLoadingHandleInviteAndCreateGroup(false);
        }
      })
      .then(() => {});
  };

  const handleCancel = () => {
    setNewMember("");
    setMemberResultSearch([]);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="w-40">{children}</AlertDialogTrigger>
      <AlertDialogContent className="opacity-100 max-w-lg bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo nhóm mới</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mb-4">
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name_group"
            >
              Tên nhóm
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name_group"
              type="text"
              placeholder="Ví dụ: 3 con báo"
              value={groupName}
              onChange={handleGroupNameChange}
            />
          </div>

          <div className="mt-4 relative">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="invited_member"
            >
              Thành viên
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="invited_member"
              type="text"
              placeholder="Vui lòng nhập email để thêm thành viên"
              value={newMember}
              onChange={handleNewMemberChange}
            />

            {newMember && (
              <div className="absolute z-50 w-full bg-white max-h-44 overflow-y-scroll shadow-lg border flex justify-start flex-col">
                {loadingSearchResult ? (
                  <div className="flex items-center gap-3 px-2 py-2 text-gray-500 text-sm">
                    <Skeleton className="w-10 h-10 object-cover rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-60 h-5" />
                      <Skeleton className="w-60 h-5" />
                    </div>
                  </div>
                ) : memberResultSearch &&
                  Array.isArray(memberResultSearch) &&
                  memberResultSearch.length > 0 ? (
                  memberResultSearch?.map((result, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer hover:bg-gray-200 px-2 py-2 items-center gap-3 transition-all duration-300 ease-in-out"
                      onClick={() => handleClickSelectMember(result)}
                    >
                      <img
                        src={
                          result.avatar_url ||
                          generateFallbackAvatar(result.email)
                        }
                        alt={result.fullname}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-normal text-sm">{result.fullname}</p>
                        <p className="font-normal opacity-70 text-sm">
                          {result.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-2 text-gray-500 text-sm">
                    Không tìm thấy người phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4">
            {memberList.length !== 0 && (
              <label className="block text-gray-700 font-bold mb-2">
                Những người đã mời
              </label>
            )}

            <div>
              {memberList.map((member, index) => (
                <div
                  className="flex items-center justify-between gap-3 mt-4"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatar_url ||
                        generateFallbackAvatar(member.email)
                      }
                      alt={""}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className={`font-normal text-sm`}>{member.fullname}</p>

                      <p className={`font-normal opacity-70 text-sm`}>
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <X
                    className="cursor-pointer w-5 h-5 text-gray-500"
                    onClick={() => removeSelectedUserFromMemberList(member)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <Button
              onClick={handleCancel}
              className="rounded-sm bg-orange-200 border-orange-200 border-2"
            >
              Hủy
            </Button>
            <Button
              className="rounded-sm bg-blue-200 border-blue-200 border-2"
              onClick={handleCreateNewGroupAndInviteMember}
            >
              Tạo nhóm
            </Button>
          </div>
        </div>
      </AlertDialogContent>

      {loadingHandleInviteAndCreateGroup && <SpinnerLoading />}
    </AlertDialog>
  );
};

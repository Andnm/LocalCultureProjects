"use client";

import { AlertDialogOnlyInviteMember } from "@/components/alert-dialog/AlertDialogOnlyInviteMember";
import { Hint } from "@/components/hint";
import {
  getAllMemberByGroupId,
  replyInviteToJoinGroup,
} from "@/src/redux/features/groupSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getUserFromSessionStorage } from "@/src/redux/utils/handleUser";
import { UserGroupType } from "@/src/types/user-group.type";
import { formatDate, generateFallbackAvatar } from "@/src/utils/handleFunction";
import Link from "next/link";
import React from "react";

import "../../style.scss";

import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";

const MemberGroup = ({ params }: { params: { groupId: number } }) => {
  const [dataGroup, setDataGroup] = React.useState<UserGroupType[]>([]);
  const [userLogin, setUserLogin] = React.useState<any>();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loadingGroup }: any = useAppSelector((state) => state.group);

  const handleGoBack = () => {
    router.back();
  };

  const handleReplyInviteMember = (
    userGroupId: number,
    relationshipStatus: string
  ) => {
    dispatch(replyInviteToJoinGroup({ userGroupId, relationshipStatus })).then(
      (result) => {
        if (replyInviteToJoinGroup.fulfilled.match(result)) {
          const leaderEmail = dataGroup
            .map((item) =>
              item.role_in_group === "Leader" ? item.user?.email : null
            )
            .filter(Boolean)
            .join(", ");

          const dataBodyNoti = {
            notification_type: NOTIFICATION_TYPE.REPLY_INVITE_MEMBER,
            information: `${userLogin?.fullname} đã ${relationshipStatus === "Joined" ? "chấp thuận" : "từ chối"} lời mời tham gia group ${dataGroup[0]?.group?.group_name} của bạn`,
            sender_email: `${userLogin?.email}`,
            receiver_email: `${leaderEmail}`,
          };

          dispatch(createNewNotification(dataBodyNoti)).then((result) => {
            console.log(result)
          })

          const updatedIndex = dataGroup.findIndex(
            (item) => item.id === result.payload.id
          );

          if (updatedIndex !== -1) {
            setDataGroup((prevDataGroup) => {
              const newDataGroup = [...prevDataGroup];
              newDataGroup[updatedIndex] = result.payload;
              return newDataGroup;
            });
          }

          toast.success(`${relationshipStatus} thành công!`);
        } else {
          toast.error(`${result.payload}`);
        }
      }
    );
  };

  React.useEffect(() => {
    dispatch(getAllMemberByGroupId(params.groupId)).then((result) => {
      if (getAllMemberByGroupId.fulfilled.match(result)) {
        setDataGroup(result.payload);
      }
    });

    setUserLogin(getUserFromSessionStorage());
  }, []);

  return (
    <div className="h-full">
      <div className="bg-white">
        <div className="min-h-full">
          {/* header */}
          <header className="bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4 lg:px-8 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol role="list" className="flex items-center space-x-4">
                    <li>
                      <div>
                        <div
                          onClick={handleGoBack}
                          className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Nhóm
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          x-description="Heroicon name: mini/chevron-right"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <Link
                          href="#"
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Thành viên
                        </Link>
                      </div>
                    </li>
                  </ol>
                </nav>
                <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {dataGroup[0]?.group?.group_name}
                </h1>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      x-description="Heroicon name: mini/briefcase"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                        clipRule="evenodd"
                      ></path>
                      <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z"></path>
                    </svg>
                    {dataGroup[0]?.group?.group_quantity} người
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      x-description="Heroicon name: mini/map-pin"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Remote
                  </div>

                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      x-description="Heroicon name: mini/calendar"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Ngày tạo: {formatDate(dataGroup[0]?.group?.createdAt)}
                  </div>
                </div>
              </div>

              {userLogin?.role_name !== "Lecturer" && (
                <div className="mt-5 flex">
                  <span className="hidden sm:block">
                    <div className="cursor-pointer inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                      <svg
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        x-description="Heroicon name: mini/pencil"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
                      </svg>
                      Sửa thông tin
                    </div>
                  </span>

                  <span className="ml-3 hidden sm:block">
                    <AlertDialogOnlyInviteMember
                      groupId={params.groupId}
                      setDataGroup={setDataGroup}
                    >
                      <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <svg
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          x-description="Heroicon name: mini/link"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path>
                          <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"></path>
                        </svg>
                        Mời
                      </div>
                    </AlertDialogOnlyInviteMember>
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* main */}
          <main className="pt-8 pb-16">
            {userLogin?.role_name === "Lecturer" && (
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                  <h2 className="text-lg font-medium text-gray-900">
                    Giảng viên
                  </h2>

                  <div className="hidden sm:block">
                    <div className="border-b border-gray-200"></div>
                  </div>
                </div>

                {dataGroup.some(
                  (member) => member.role_in_group === "Lecturer"
                ) ? (
                  <ul
                    role="list"
                    className="mt-5 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0"
                  >
                    {dataGroup.map((member, index) =>
                      member.relationship_status !== "Rejected" &&
                      member.role_in_group === "Lecturer" ? (
                        <li key={index}>
                          <div className="group block">
                            <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                              <div className="flex min-w-0 flex-1 items-center">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-12 w-12 rounded-full group-hover:opacity-75 object-cover object-center"
                                    src={
                                      member?.user?.avatar_url ||
                                      generateFallbackAvatar(
                                        member?.user?.email
                                      )
                                    }
                                    alt=""
                                  />
                                </div>

                                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                                  {/* fullname + email */}
                                  <div>
                                    <p className="truncate text-sm font-medium text-purple-600">
                                      {member?.user?.fullname}
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                      <svg
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                        x-description="Heroicon name: mini/envelope"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"></path>
                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"></path>
                                      </svg>
                                      <span className="truncate">
                                        {member?.user?.email}
                                      </span>
                                    </p>
                                  </div>

                                  {/* Role in group */}
                                  <div className="hidden md:block">
                                    <div>
                                      <p className="text-sm text-gray-900">
                                        Giảng viên
                                      </p>
                                      <p className="mt-2 flex items-center text-sm text-gray-500">
                                        {member.relationship_status ===
                                        "Joined" ? (
                                          <>
                                            <svg
                                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                              x-description="Heroicon name: mini/check-circle"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              aria-hidden="true"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clipRule="evenodd"
                                              ></path>
                                            </svg>
                                            Đã tham gia nhóm
                                          </>
                                        ) : (
                                          <>Đang chờ phê duyệt</>
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {/* xử lý chấp thuận join group */}
                                  {member.relationship_status === "Pending" &&
                                  member.user?.email === userLogin.email ? (
                                    <div className="flex items-center gap-4">
                                      <Hint
                                        sideOffset={10}
                                        description={`Đồng ý vào nhóm`}
                                        side={"top"}
                                      >
                                        <div
                                          onClick={() =>
                                            handleReplyInviteMember(
                                              member?.id,
                                              "Joined"
                                            )
                                          }
                                          className="flex agree-invite items-center gap-1 text-sm text-gray-500 cursor-pointer transition ease-in-out "
                                        >
                                          <FaRegCheckCircle className="w-5 h-5 text-green-300 transition ease-in-out" />
                                          Chấp thuận
                                        </div>
                                      </Hint>

                                      <Hint
                                        sideOffset={10}
                                        description={`Từ chối vào nhóm`}
                                        side={"top"}
                                      >
                                        <div
                                          onClick={() =>
                                            handleReplyInviteMember(
                                              member.id,
                                              "Rejected"
                                            )
                                          }
                                          className="flex disagree-invite items-center gap-1 text-sm text-gray-500 cursor-pointer transition ease-in-out"
                                        >
                                          <MdOutlineCancel className="w-6 h-6 text-red-300 transition ease-in-out" />
                                          Từ chối
                                        </div>
                                      </Hint>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>

                              {/* arrow */}
                              <div>
                                <svg
                                  className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                                  x-description="Heroicon name: mini/chevron-right"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </li>
                      ) : (
                        <></>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="my-4">Chưa mời giảng viên</p>
                )}
              </div>
            )}

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 ">
              <div className="px-4 sm:px-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Thành viên
                </h2>

                <div className="hidden sm:block">
                  <div className="border-b border-gray-200"></div>
                </div>
              </div>

              <ul
                role="list"
                className="mt-5 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0"
              >
                {dataGroup.map((member, index) =>
                  member.relationship_status !== "Rejected" &&
                  member.role_in_group !== "Lecturer" ? (
                    <li key={index}>
                      <div className="group block">
                        <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                          <div className="flex min-w-0 flex-1 items-center">
                            <div className="flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-full group-hover:opacity-75 object-cover object-center"
                                src={
                                  member?.user?.avatar_url ||
                                  generateFallbackAvatar(member?.user?.email)
                                }
                                alt=""
                              />
                            </div>

                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                              {/* fullname + email */}
                              <div>
                                <p className="truncate text-sm font-medium text-purple-600">
                                  {member?.user?.fullname}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                  <svg
                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    x-description="Heroicon name: mini/envelope"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"></path>
                                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"></path>
                                  </svg>
                                  <span className="truncate">
                                    {member?.user?.email}
                                  </span>
                                </p>
                              </div>

                              {/* Role in group */}
                              <div className="hidden md:block">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {member.role_in_group === "Leader"
                                      ? "Trưởng nhóm"
                                      : "Thành viên"}
                                  </p>
                                  <p className="mt-2 flex items-center text-sm text-gray-500">
                                    {member.relationship_status === "Joined" ? (
                                      <>
                                        <svg
                                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                          x-description="Heroicon name: mini/check-circle"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          aria-hidden="true"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                        Đã tham gia nhóm
                                      </>
                                    ) : (
                                      <>Đang chờ phê duyệt</>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* xử lý chấp thuận join group */}
                              {member.relationship_status === "Pending" &&
                              member.user?.email === userLogin?.email ? (
                                <div className="flex items-center gap-4">
                                  <Hint
                                    sideOffset={10}
                                    description={`Đồng ý vào nhóm`}
                                    side={"top"}
                                  >
                                    <div
                                      onClick={() =>
                                        handleReplyInviteMember(
                                          member?.id,
                                          "Joined"
                                        )
                                      }
                                      className="flex agree-invite items-center gap-1 text-sm text-gray-500 cursor-pointer transition ease-in-out "
                                    >
                                      <FaRegCheckCircle className="w-5 h-5 text-green-300 transition ease-in-out" />
                                      Chấp thuận
                                    </div>
                                  </Hint>

                                  <Hint
                                    sideOffset={10}
                                    description={`Từ chối vào nhóm`}
                                    side={"top"}
                                  >
                                    <div
                                      onClick={() =>
                                        handleReplyInviteMember(
                                          member.id,
                                          "Rejected"
                                        )
                                      }
                                      className="flex disagree-invite items-center gap-1 text-sm text-gray-500 cursor-pointer transition ease-in-out"
                                    >
                                      <MdOutlineCancel className="w-6 h-6 text-red-300 transition ease-in-out" />
                                      Từ chối
                                    </div>
                                  </Hint>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>

                          {/* arrow */}
                          <div>
                            <svg
                              className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                              x-description="Heroicon name: mini/chevron-right"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <></>
                  )
                )}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberGroup;

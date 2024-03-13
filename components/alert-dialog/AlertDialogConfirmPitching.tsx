"use client";

import React, { Fragment } from "react";

import { useRouter } from "next/navigation";

import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import toast from "react-hot-toast";
import { registerPitching } from "@/src/redux/features/pitchingSlice";
import { FaCheck } from "react-icons/fa6";
import { HiChevronUpDown } from "react-icons/hi2";

import { Listbox, Transition } from "@headlessui/react";
import Link from "next/link";
import { X } from "lucide-react";
import Select from "react-select";
import { searchUserByEmail } from "@/src/redux/features/userSlice";
import { Skeleton } from "../ui/skeleton";
import {
  generateFallbackAvatar,
  truncateString,
} from "@/src/utils/handleFunction";
import { storage } from "@/src/utils/configFirebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { useUserLogin } from "@/src/hook/useUserLogin";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/utils/configFirebase";
import { createUserChat } from "@/src/redux/features/userChatSlice";

interface AlertDialogConfirmPitchingProps {
  dataProject: any;
  children: React.ReactNode;
  projectId: number;
  groupList: any;
}

export const AlertDialogConfirmPitching: React.FC<
  AlertDialogConfirmPitchingProps
> = ({ children, projectId, groupList, dataProject }) => {
  const [open, setOpen] = React.useState(false);

  const [loadingRegisterPitching, setLoadingRegisterPitching] =
    React.useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loadingPitching }: any = useAppSelector((state) => state.pitching);

  const [selected, setSelected] = React.useState(
    groupList[0]?.group?.group_name
  );

  //subject
  const [selectedSubjectCode, setSelectedSubjectCode] = React.useState<any>();

  const handleSelectChange = (selectedOption: any) => {
    setSelectedSubjectCode(selectedOption);
  };

  const optionsSubjectCode = [
    { value: "MKT304", label: "MKT304" },
    { value: "CCO201", label: "CCO201" },
    { value: "MPL201", label: "MPL201" },
    { value: "BRA301", label: "BRA301" },
    { value: "MCO201m", label: "MCO201m" },
    { value: "MEP201", label: "MEP201" },
    { value: "GRA497", label: "GRA497" },
    { value: "CSP201m", label: "CSP201m" },
    { value: "MCO206m", label: "MCO206m" },
    { value: "PRE202", label: "PRE202" },
  ] as any;

  //chọn email giảng viên
  const [newMember, setNewMember] = React.useState<string>("");
  const [loadingSearchResult, setLoadingSearchResult] = React.useState(false);
  const [memberResultSearch, setMemberResultSearch] = React.useState<any[]>([]);
  const [memberList, setMemberList] = React.useState<any[]>([]);
  //

  const [userLogin, setUserLogin] = useUserLogin();

  const handleNewMemberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingSearchResult(true);
    setNewMember(event.target.value);
    // console.log('email search', event.target.value)

    dispatch(
      searchUserByEmail({
        roleName: "Lecturer",
        searchEmail: event.target.value,
      })
    ).then((result) => {
      if (searchUserByEmail.fulfilled.match(result)) {
        setMemberResultSearch(result.payload);
        setLoadingSearchResult(false);
      } else {
        // console.log(result.payload)
      }
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

  // upfile
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null
  );
  const [downloadURL, setDownloadURL] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };
  // console.log(dataProject)
  const handleUpload = async () => {
    setLoadingRegisterPitching(true);

    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Lỗi khi tải tệp lên Firebase Storage", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadURL(downloadURL);

            const email_of_lecture: string = memberList[0]?.email;
            const subject_code: string = selectedSubjectCode?.value;

            const dataBody = {
              groupId: selected?.group?.id,
              projectId: projectId,
              document_url: downloadURL,
              subject_code: subject_code,
              lecturer_email: email_of_lecture,
            };

            const result = await dispatch(registerPitching(dataBody));

            if (registerPitching.fulfilled.match(result)) {
              const dataBodyNoti = {
                notification_type: NOTIFICATION_TYPE.REGISTER_PITCHING_BUSINESS,
                information: `Nhóm ${selected?.group?.group_name} đã đăng kí pitching dự án ${dataProject?.name_project} của bạn`,
                sender_email: `${userLogin?.email}`,
                receiver_email: `${dataProject?.business?.email}`,
              };

              const resNoti = await dispatch(
                createNewNotification(dataBodyNoti)
              );

              console.log(selected);
              const compareIdentifierUserChat = `${dataProject?.id}-${selected?.group?.id}`;

              const dataBody = {
                groupName: selected?.group?.group_name,
                avatarGroup: userLogin?.avatar_url,
                lastMessage: "",
                identifierUserChat: compareIdentifierUserChat,
              };

              dispatch(createUserChat(dataBody)).then((result) => {
                if (createUserChat.fulfilled.match(result)) {
                  console.log("tạo userChat thành công");
                  console.log("create userchat SUCCESS", result.payload);
                } else {
                  console.log("create userchat FAIL", result.payload);
                  console.log("tạo userchat thất bại");
                }
              });

              //FIREBASE

              // try {
              //   await setDoc(doc(db, "userChats", compareIdentifierUserChat), {
              //     groupName: selected?.group?.group_name,
              //     avatarGroup: userLogin?.avatar_url,
              //     lastMessages: " ",
              //     identifierUserChat: compareIdentifierUserChat,
              //     createdAt: serverTimestamp(),
              //   });
              // } catch (error) {
              //   console.error("Error handling the message:", error);
              // }

              router.push("/student-board");
              toast.success("Đăng kí thành công!");
            } else {
              console.log(result.payload);
              toast.error(`${result.payload}`);
            }

            setOpen(false);
            setLoadingRegisterPitching(false);
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }
      );
    } else {
      const email_of_lecture: string = memberList[0]?.email;
      const subject_code: string = selectedSubjectCode?.value;

      const dataBody = {
        groupId: selected?.group?.id,
        projectId: projectId,
        document_url: "",
        subject_code: subject_code,
        lecturer_email: email_of_lecture,
      };

      const result = await dispatch(registerPitching(dataBody));

      // const compareIdentifierUserChat = `${dataProject?.id}-${selected?.group?.id}`;

      // const dataBody1 = {
      //   groupName: selected?.group?.group_name,
      //   avatarGroup: userLogin?.avatar_url,
      //   lastMessage: "",
      //   identifierUserChat: compareIdentifierUserChat,
      // };

      // dispatch(createUserChat(dataBody1)).then((result) => {
      //   if (createUserChat.fulfilled.match(result)) {
      //     console.log("tạo userChat thành công");
      //     console.log("create userchat SUCCESS", result.payload);
      //   } else {
      //     console.log("create userchat FAIL", result.payload);
      //     console.log("tạo userchat thất bại");
      //   }
      // });

      if (registerPitching.fulfilled.match(result)) {
        const dataBodyNoti = {
          notification_type: NOTIFICATION_TYPE.REGISTER_PITCHING_BUSINESS,
          information: `Nhóm ${selected?.group?.group_name} đã đăng kí pitching dự án ${dataProject?.name_project} của bạn`,
          sender_email: `${userLogin?.email}`,
          receiver_email: `${dataProject?.business?.email}`,
        };

        const resNoti = await dispatch(createNewNotification(dataBodyNoti));

        console.log(selected);
        const compareIdentifierUserChat = `${dataProject?.id}-${selected?.group?.id}`;

        const dataBody = {
          groupName: selected?.group?.group_name,
          avatarGroup: userLogin?.avatar_url,
          lastMessage: "",
          identifierUserChat: compareIdentifierUserChat,
        };

        dispatch(createUserChat(dataBody)).then((result) => {
          if (createUserChat.fulfilled.match(result)) {
            console.log("tạo userChat thành công");
            console.log("create userchat SUCCESS", result.payload);
          } else {
            console.log("create userchat FAIL", result.payload);
            console.log("tạo userchat thất bại");
          }
        });

        //FIREBASE

        // try {
        //   await setDoc(doc(db, "userChats", compareIdentifierUserChat), {
        //     groupName: selected?.group?.group_name,
        //     avatarGroup: userLogin?.avatar_url,
        //     lastMessages: " ",
        //     identifierUserChat: compareIdentifierUserChat,
        //     createdAt: serverTimestamp(),
        //   });
        // } catch (error) {
        //   console.error("Error handling the message:", error);
        // }

        router.push("/student-board");
        toast.success("Đăng kí thành công!");
      } else {
        console.log(result.payload);
        toast.error(`${result.payload}`);
      }

      setOpen(false);
      setLoadingRegisterPitching(false);
      // toast.error('Vui lòng cập nhập file giới thiệu nhóm')
      // setLoadingRegisterPitching(false);
    }
  };

  const handleConfirmRegisterPitching = () => {
    handleUpload();
  };

  const pushIntoCreateGroup = () => {
    router.push("/group");
  };

  const handleCancel = () => {
    setNewMember("");
    setMemberResultSearch([]);
    setOpen(false);
  };

  if (Array.isArray(groupList) && groupList?.length === 0) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>{children}</AlertDialogTrigger>

        <AlertDialogContent className="opacity-100 max-w-lg bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Vui lòng{" "}
              <Link href="/group" className="underline hover:text-red-400">
                tạo nhóm
              </Link>{" "}
              trước khi đăng kí pitching
            </AlertDialogTitle>

            <X
              onClick={() => setOpen(false)}
              className="absolute top-0 right-2 w-5 h-5 cursor-pointer text-gray-400"
            />
          </AlertDialogHeader>

          <div className="flex gap-4 justify-end mt-4">
            <AlertDialogCancel className="rounded-sm bg-orange-200 border-orange-200 border-2">
              Tạo sau
            </AlertDialogCancel>
            <Button
              className="rounded-sm bg-blue-200 border-blue-200 border-2"
              onClick={pushIntoCreateGroup}
            >
              Xác nhận
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="opacity-100 max-w-lg bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Mẫu đăng kí</AlertDialogTitle>
          <X
            onClick={() => setOpen(false)}
            className="absolute top-0 right-2 w-5 h-5 cursor-pointer text-gray-400"
          />
        </AlertDialogHeader>

        <div className="top-16">
          <div>
            <p>Chọn mã môn: </p>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={""}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              name="color"
              options={optionsSubjectCode}
              placeholder="Chọn mã môn học"
              onChange={handleSelectChange}
              value={selectedSubjectCode}
            />
          </div>

          <div className="my-4">
            <div className="mt-4 relative">
              {memberList.length === 0 && (
                <>
                  <label className="block mb-2" htmlFor="invited_member">
                    Chọn giảng viên:
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="invited_member"
                    type="text"
                    placeholder="Vui lòng nhập email để thêm giảng viên"
                    value={newMember}
                    onChange={handleNewMemberChange}
                  />
                </>
              )}

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
                          <p className="font-normal text-sm">
                            {result.fullname}
                          </p>
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
                  Giảng viên đã mời
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
                        <p className={`font-normal text-sm`}>
                          {member.fullname}
                        </p>

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
          </div>

          <div className="my-4">
            <p>Tài liệu của nhóm: </p>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="">
            <p>Chọn nhóm: </p>
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1 ">
                <Listbox.Button className="h-10 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-2 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selected?.group?.group_name}
                  </span>
                  <span className="pointer-events-none  absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiChevronUpDown
                      className="h-5 w-5 text-black-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {groupList.map((group: any, index: number) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={group}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {group.group?.group_name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <FaCheck
                                  className="h-5 w-5 text-amber-600"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
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
            onClick={handleConfirmRegisterPitching}
          >
            Xác nhận đăng kí
          </Button>
        </div>
      </AlertDialogContent>

      {loadingRegisterPitching && <SpinnerLoading />}
    </AlertDialog>
  );
};

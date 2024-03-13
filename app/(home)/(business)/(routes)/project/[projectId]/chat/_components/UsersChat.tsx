"use client";

import React from "react";
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
import { useAuthContext } from "@/src/utils/context/auth-provider";
import {
  convertTimestampToDate,
  extractNumberAtIndex,
  getDateTimeDifference,
  truncateString,
} from "@/src/utils/handleFunction";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useAppDispatch } from "@/src/redux/store";
import { getUserChat } from "@/src/redux/features/userChatSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersChatProps {
  arrayGroupId?: number[];
  projectId: number;
  userLogin: any;
}

const UsersChat: React.FC<UsersChatProps> = ({
  arrayGroupId,
  projectId,
  userLogin,
}) => {
  const [usersChatState, setUsersChatState] = React.useState<any>([]);
  const { selectedUserChat, setSelectedUserChat }: any = useAuthContext();
  const [loadingUserChat, setLoadingUserChat] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // const q = query(collection(db, "userChats"), orderBy("createdAt", "desc"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const usersChat: any[] = [];
    //   querySnapshot.forEach((doc: any) => {
    //     const docData = doc.data() as any;

    //     if (extractNumberAtIndex(docData.identifierUserChat, 1) === projectId) {
    //       if (userLogin?.role_name === "Business") {
    //         usersChat.push({ ...docData, id: doc.id });
    //       } else if (
    //         arrayGroupId?.includes(
    //           extractNumberAtIndex(docData.identifierUserChat, 2) as number
    //         )
    //       ) {
    //         usersChat.push({ ...docData, id: doc.id });
    //       }
    //     }
    //   });

    //   setUsersChatState(usersChat);
    // });

    // return () => unsubscribe();
    dispatch(getUserChat()).then((result) => {
      setLoadingUserChat(true);
      socketInstance.on("getAllUserChats", (data: any) => {
        const dataResponse = data.userChats;
        // console.log("dataResponse", dataResponse);
        const usersChat: any[] = [];

        dataResponse.forEach((item: any) => {
          if (extractNumberAtIndex(item.identifierUserChat, 1) === projectId) {
            if (userLogin?.role_name === "Business") {
              usersChat.push({ ...item });
            } else if (
              arrayGroupId?.includes(
                extractNumberAtIndex(item.identifierUserChat, 2) as number
              )
            ) {
              usersChat.push({ ...item });
            }
          }
        });
        // console.log(usersChat);

        setUsersChatState(usersChat);
      });

      if (getUserChat.fulfilled.match(result)) {
        setLoadingUserChat(false);
      }
    });
  }, [usersChatState]);

  const handleUserClick = (identifierUserChat: string, groupName: string) => {
    setSelectedUserChat({
      groupId: extractNumberAtIndex(identifierUserChat, 2),
      groupName: groupName,
    });
  };

  if (loadingUserChat) {
    return (
      <div>
        <div className="flex userChat p-3">
          <Skeleton className="h-10 w-10"></Skeleton>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-16"></Skeleton>
            <Skeleton className="h-6 w-36"></Skeleton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {usersChatState?.map((obj: any, index: number) => (
        <div
          className={
            selectedUserChat?.groupName === obj?.groupName
              ? "userChat selected"
              : "userChat"
          }
          key={index}
          onClick={() =>
            handleUserClick(obj?.identifierUserChat, obj?.groupName)
          }
        >
          <img src={obj?.avatarGroup} alt="" />
          <div className="userChatInfo">
            <span>{obj?.groupName}</span>

            {obj?.lastMessage !== "" && (
              <div
                className={`block ${
                  obj?.newMsg ? "text-black font-bold" : "text-gray-400"
                }`}
              >
                {userLogin?.email === obj?.senderEmail
                  ? "Bạn: "
                  : `${obj?.lastNameSender}: `}
                {truncateString(obj?.lastMessage, 9)}{" "}
                <p className="inline-block font-normal align-text-bottom">.</p>{" "}
                <p className="inline-block font-normal">
                  {getDateTimeDifference(obj?.updatedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersChat;

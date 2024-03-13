"use client";

import React from "react";
import ChatSpace from "./_components/ChatSpace";
import SidebarChat from "./_components/SidebarChat";
import "./style/style.scss";
import { useAppDispatch } from "@/src/redux/store";
import { getAllRegisterPitchingOfStudentByProjectId } from "@/src/redux/features/pitchingSlice";
import { useParams } from "next/navigation";
import { useUserLogin } from "@/src/hook/useUserLogin";

const ChatPage = () => {
  // call api ở đây để lấy data rồi truyền vào props để lấy cho đúng

  const dispatch = useAppDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const [arrayGroupId, setArrayGroupId] = React.useState<number[]>([]);
  const [userLogin, setUserLogin] = useUserLogin();

  React.useEffect(() => {
    dispatch(
      getAllRegisterPitchingOfStudentByProjectId(parseInt(projectId, 10))
    ).then((result) => {
      if (Array.isArray(result.payload)) {
        const groupIds: number[] = result.payload.map(
          (pitching: any) => pitching?.group?.id
        );
        console.log(groupIds);
        setArrayGroupId(groupIds);
      }
    });
  }, []);

  return (
    <div className="p-2 h-full">
      <div className="default-chatbox-home">
        <div className="chatbox-management">
          <SidebarChat
            userLogin={userLogin}
            arrayGroupId={arrayGroupId}
            projectId={parseInt(projectId, 10)}
          />
          <ChatSpace
            arrayGroupId={arrayGroupId}
            projectId={parseInt(projectId, 10)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

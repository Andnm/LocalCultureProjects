"use client";

import { Camera, MoreHorizontal } from "lucide-react";
import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useAuthContext } from "@/src/utils/context/auth-provider";

interface ChatSpaceProps {
  arrayGroupId?: number[];
  projectId: number;
}

const ChatSpace: React.FC<ChatSpaceProps> = ({ arrayGroupId, projectId }) => {
  const { selectedUserChat }: any = useAuthContext();

  return (
    <div className="chat-space">
      {selectedUserChat?.groupName ? (
        <>
          <div className="chatInfo">
            <span>{selectedUserChat?.groupName}</span>
            <div className="chatIcons">
              <Camera />
              <MoreHorizontal />
            </div>
          </div>
          <Messages arrayGroupId={arrayGroupId} projectId={projectId} />
          <Input projectId={projectId}/>
        </>
      ) : (
        <div className="emptyConversation">
          <p>Chọn cuộc hội thoại để hiển thị dữ liệu</p>
        </div>
      )}
    </div>
  );
};

export default ChatSpace;

import React from "react";
import Search from "./Search";
import UsersChat from "./UsersChat";

interface SidebarChatProps {
  arrayGroupId?: number[];
  projectId: number;
  userLogin: any;
}

const SidebarChat: React.FC<SidebarChatProps> = ({ arrayGroupId, projectId, userLogin }) => {
  return (
    <div className="sidebar-chat">
      <div className="navbar">
        <span>Đoạn Chat</span>
      </div>

      <Search />

      <UsersChat
        userLogin={userLogin}
        arrayGroupId={arrayGroupId}
        projectId={projectId}
      />
    </div>
  );
};

export default SidebarChat;

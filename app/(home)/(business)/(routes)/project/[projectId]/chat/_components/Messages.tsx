"use client";

import { useAuthContext } from "@/src/utils/context/auth-provider";
import React from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/src/utils/configFirebase";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useAppDispatch } from "@/src/redux/store";
import { getAllMessages } from "@/src/redux/features/messageSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";

interface Message {
  text: string;
  name: string;
  avatar: string;
  createdAt: string;
  combinedEmail: string;
  senderEmail: string;
  identifierUserChat: string;
}

interface MessageProps {
  message: Message;
}

interface MessagesProps {
  arrayGroupId?: number[];
  projectId: number;
}

const Messages: React.FC<MessagesProps> = ({ arrayGroupId, projectId }) => {
  const { selectedUserChat, setSelectedUserChat }: any = useAuthContext();
  const [messages, setMessages] = React.useState<any>([]);
  const [userLogin, setUserLogin] = useUserLogin();
  const compareIdentifierUserChat = `${projectId}-${selectedUserChat.groupId}`;
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  React.useEffect(() => {
    // const q = query(
    //   collection(db, "messages"),
    //   orderBy("createdAt")
    //   // limit(50),
    // );
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const messagesInChat: any[] = [];

    //   querySnapshot.forEach((doc) => {
    //     const docData = doc.data();

    //     if (docData.identifierUserChat === compareIdentifierUserChat) {
    //       messagesInChat.push({ ...docData, id: doc.id });
    //     }
    //   });

    //   setMessages(messagesInChat);
    // });

    // return () => unsubscribe();

    dispatch(getAllMessages(compareIdentifierUserChat)).then((result) => {
      socketInstance.on(
        `getAllMessage-${compareIdentifierUserChat}`,
        (data: any) => {
          console.log("data", data.messages);
          setMessages(data.messages);
        }
      );
    });
  }, [selectedUserChat]);

  const Message: React.FC<MessageProps> = ({ message }) => {
    return (
      <div
        className={
          message.senderEmail === userLogin?.email ? "message owner" : "message"
        }
      >
        <div className="messageInfo">
          <img className="logo-owner" src={message.avatar} alt="" />
        </div>
        <div className="messageContent">
          <p>{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="messages overflow-y-scroll">
      {Array.isArray(messages) && messages.length === 0 ? (
        <p className="flex text-white text-lg justify-center h-full">
          Gõ gì đó để gửi tin nhắn
        </p>
      ) : (
        messages.map((m: any, index: number) => (
          <Message key={index} message={m} />
        ))
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;

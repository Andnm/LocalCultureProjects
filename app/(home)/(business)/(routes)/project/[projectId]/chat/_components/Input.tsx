"use client";

import { useAuthContext } from "@/src/utils/context/auth-provider";
import { Image, Send } from "lucide-react";
import React from "react";
import { IoAttach } from "react-icons/io5";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/utils/configFirebase";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { extractLastName } from "@/src/utils/handleFunction";
import { useAppDispatch } from "@/src/redux/store";
import { createMessage } from "@/src/redux/features/messageSlice";
import { updateUserChat } from "@/src/redux/features/userChatSlice";
import toast from "react-hot-toast";

interface InputProps {
  projectId: number;
}

const Input: React.FC<InputProps> = ({ projectId }) => {
  const [valueText, setValueText] = React.useState("");

  const { selectedUserChat }: any = useAuthContext();
  const [userLogin, setUserLogin] = useUserLogin();
  const dispatch = useAppDispatch();

  // projectId-groupId
  const compareIdentifierUserChat = `${projectId}-${selectedUserChat.groupId}`;

  const handleSendMessage = async (e: any) => {
    e.preventDefault();

    if (valueText.trim() === "") {
      return;
    }

    // try {
    //   await addDoc(collection(db, "messages"), {
    //     text: valueText,
    //     name: userLogin?.fullname,
    //     avatar: userLogin?.avatar_url,
    //     createdAt: serverTimestamp(),
    //     groupId: selectedUserChat.groupId,
    //     senderEmail: userLogin?.email,
    //     identifierUserChat: compareIdentifierUserChat,
    //   });

    //   const userChatsRef = doc(db, "userChats", compareIdentifierUserChat);

    //   await updateDoc(userChatsRef, {
    //     newMsg: true,
    //     lastMessages: valueText,
    //     senderEmail: userLogin?.email,
    //     lastNameSender: extractLastName(userLogin?.fullname as string),
    //     createdAt: serverTimestamp(),
    //   });
    // } catch (error) {
    //   console.error("Error send messages: ", error);
    // }

    const dataBodyCreateMsg = {
      text: valueText,
      name: userLogin?.fullname,
      avatar: userLogin?.avatar_url,
      groupId: selectedUserChat.groupId,
      senderEmail: userLogin?.email,
      identifierUserChat: compareIdentifierUserChat,
    };

    dispatch(createMessage(dataBodyCreateMsg)).then((result) => {
      // console.log("create msg", result);
      if (createMessage.rejected.match(result)) {
        toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau!");
      }
    });

    const dataBody = {
      lastMessage: valueText,
      senderEmail: userLogin?.email,
      lastNameSender: extractLastName(userLogin?.fullname as string),
    };

    dispatch(
      updateUserChat({
        identifierUserChat: compareIdentifierUserChat,
        dataBody,
      })
    ).then((result) => {
      if (updateUserChat.rejected.match(result)) {
        console.log("error", result.payload);
      }
      // console.log("update user chat", result);
    });

    setValueText("");
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
      setValueText("");
    }
  };
  return (
    <div className="input-chatbox">
      <input
        type="text"
        placeholder="Gõ gì đó..."
        onChange={(e) => setValueText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={valueText}
      />
      <div className="send">
        <IoAttach className="w-6 h-6" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <Image className="w-5 h-5" />
        </label>
        <button onClick={handleSendMessage}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Input;

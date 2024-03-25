"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  //   auth: any | null;
  selectedUserChat: any | null;
  setSelectedUserChat: React.Dispatch<React.SetStateAction<any[]>>;
  selectedProjectContext: any | null;
  setSelectedProjectContext: React.Dispatch<React.SetStateAction<any[]>>;
  loginInfo: any | null;
  setLoginInfo: React.Dispatch<React.SetStateAction<any[]>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUserChat, setSelectedUserChat] = useState<any | null>([]);
  const [selectedProjectContext, setSelectedProjectContext] = useState<
    any | null
  >([]);
  const [loginInfo, setLoginInfo] = useState<any | null>({
    email: "",
    password: "",
  });

  return (
    <AuthContext.Provider
      value={{
        selectedUserChat,
        setSelectedUserChat,
        selectedProjectContext,
        setSelectedProjectContext,
        loginInfo,
        setLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

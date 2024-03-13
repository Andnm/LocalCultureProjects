"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  //   auth: any | null;
  selectedUserChat: any | null;
  setSelectedUserChat: React.Dispatch<React.SetStateAction<any[]>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUserChat, setSelectedUserChat] = useState<any | null>([]);

  return (
    <AuthContext.Provider value={{ selectedUserChat, setSelectedUserChat }}>
      {children}
    </AuthContext.Provider>
  );
};

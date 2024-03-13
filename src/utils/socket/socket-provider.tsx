"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  dataNotificationSocket: any;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  dataNotificationSocket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

let socketInstance: Socket;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [dataNotificationSocket, setDataNotificationSocket] = useState<any>([]);

  useEffect(() => {
    socketInstance = new (ClientIO as any)(
      `${process.env.NEXT_PUBLIC_API_URL}`
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("getNotifications", (data: any) => {
      setDataNotificationSocket(data);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, dataNotificationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { socketInstance };

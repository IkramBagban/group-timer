import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(j);

  useEffect(() => {
    if(socket?.connected) return console.log('socket already connected', socket)
    const newSocket = io("http://localhost:2300/", {
      forceNew: true, 
    });

    setSocket(newSocket);
    newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

    console.log("Creating new socket connection:", newSocket.connected);

    return () => {
      console.log("Disconnecting socket");
    };
  }, []); 

  return socket;
};

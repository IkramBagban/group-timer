import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // let sock;
    if (!socket) {
     let sock = io("http://localhost:2300/");
      setSocket(sock);
      console.log("sock.connected", sock?.connected);


    }
    return () => {
        // if(sock)
      socket?.disconnect();
    };
  }, [socket]);

  return socket;
};

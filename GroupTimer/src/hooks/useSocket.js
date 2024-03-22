// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// export const useSocket = () => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // let sock;
//     if (!socket) {
//      let sock = io("http://localhost:2300/");
//       setSocket(sock);
//       console.log("sock.connected", sock?.connected);


//     }
//     return () => {
//         // if(sock)
//       socket?.disconnect();
//     };
//   }, [socket]);

//   return socket;
// };
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(j);

  useEffect(() => {
    // Initialize socket connection only once
    if(socket?.connected) return console.log('socket already connected', socket)
    const newSocket = io("http://localhost:2300/", {
      // Options: Add any additional options here
      forceNew: true, // Force new connection every time if needed
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
    //   newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return socket;
};

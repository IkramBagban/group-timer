// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create the context
const SocketContext = createContext();

// Create a provider component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket connection
        const newSocket = io("http://localhost:2300/");
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(`Socket connected: ${newSocket.id}`);
        });

        newSocket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${reason}`);
        });

        return () => {
            console.log("Disconnecting socket");
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Hook to use the socket
export const useSocket = () => useContext(SocketContext);

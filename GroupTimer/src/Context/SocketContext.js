import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_URL } from '../../config';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(API_URL);
        console.log('url connected', API_URL)
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

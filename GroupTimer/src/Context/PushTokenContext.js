import React, { createContext, useContext, useState } from 'react';

const PushTokenContext = createContext();

export const usePushToken = () => useContext(PushTokenContext);

export const PushTokenProvider = ({ children }) => {
  const [pushToken, setPushToken] = useState(null);
console.log("PPP =>" , pushToken)
  return (
    <PushTokenContext.Provider value={{ pushToken, setPushToken }}>
      {children}
    </PushTokenContext.Provider>
  );
};

import {
  handleSessionJoin,
  handleSessionLeave,
  handleStartSessionCountdown,
  updateUserAttribute,
} from "./socketFunctions.js";

const handleSocketEvents = (io, sessions) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("doesSessionExist", (sessionCode) => {
      const sessionExists = !!sessions[sessionCode];
      socket.emit("isExistingSession", sessionExists);
    });

    
    // Handles a new or existing user joining a session.
    socket.on("session:join", ({ sessionCode, userDetail }) => {
      if (!sessions[sessionCode]) sessions[sessionCode] = { users: [] };
      handleSessionJoin(sessionCode, userDetail, socket);
    });

    // Updates the readiness of a user within a session.
    socket.on("user:ready", ({ sessionCode, userId }) => {
      updateUserAttribute(sessionCode, userId, "isReady", true);
    });

    // Updates the application state of a user within a session.
    socket.on("user:updateAppState", ({ sessionCode, userId, appState }) => {
      updateUserAttribute(sessionCode, userId, "appState", appState);
    });

    // Initiates the countdown for the session to start.
    socket.on("session:startCountdown", (sessionCode) => {
      handleStartSessionCountdown(sessionCode, socket);
    });

    // Handles a user leaving a session.
    socket.on("session:leave", (sessionCode, socketId) => {
      handleSessionLeave(sessionCode, socketId);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default handleSocketEvents;

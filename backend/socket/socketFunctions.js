import { io, sessions } from "../index.js";
import { emitSessionUpdates } from "../utils/emitSessionUpdates.js";
import { onSessionEnd } from "../utils/onSessionEnd.js";
import { notifyUserIfBackground } from "../utils/sendBackgroundNotification.js";

const handleSessionJoin = (sessionCode, userDetail, socket) => {
  let isCreator = false;
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { users: [] };
    isCreator = true;
  }
  const ud = { ...userDetail, isCreator: isCreator };
  sessions[sessionCode].users.push({ ...ud, socketId: socket.id });
  socket.join(sessionCode);
  io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
};

// Updates specified user attribute within a session.
const updateUserAttribute = (sessionCode, userId, attribute, value) => {
  const session = sessions[sessionCode];
  if (!session) return;

  const userIndex = session.users.findIndex((user) => user.userId === userId);
  if (userIndex !== -1) {
    sessions[sessionCode].users[userIndex][attribute] = value; // Update attribute
    emitSessionUpdates(sessionCode); // Emit session updates
  }
};

// Starts a countdown for the session and manages notifications and user times.
const handleStartSessionCountdown = (sessionCode, socket) => {
  const session = sessions[sessionCode];
  if (!session || !session.users.every((user) => user.isReady)) {
    console.log("Session not ready or does not exist.");
    return;
  }

  session.users.sort((a, b) => b.totalTime - a.totalTime);
  let remainingTime = session.users[0].totalTime + 5; // Include a 5-second buffer before starting
  socket.to(sessionCode).emit("startingSession", session.users[0]);

  const countdownInterval = setInterval(() => {
    remainingTime--;

    if (remainingTime === 0)
      return onSessionEnd(sessionCode, countdownInterval);

    for (let user of session?.users) {
      // Notify user 5 seconds before their countdown starts
      if (remainingTime === user.totalTime + 5) {
        notifyUserIfBackground(
          user,
          "Alert",
          "Your timer will start after 5 seconds."
        );
      }
      // Adjust user's totalTime as the session countdown progresses
      if (remainingTime <= user.totalTime) user.totalTime--;
    }
    io.to(sessionCode).emit("sessionUpdate", session.users);
  }, 1000);
};

const handleSessionLeave = (sessionCode, socketId) => {
  if (sessions[sessionCode]) {
    // Remove the user from the session
    sessions[sessionCode].users = sessions[sessionCode].users.filter(
      (user) => user.socketId !== socketId
    );

    // Check if there are no more users left in the session
    if (sessions[sessionCode].users.length === 0) {
      // If no users are left, delete the session
      delete sessions[sessionCode];
      console.log(
        `Session ${sessionCode} removed, as there are no more users.`
      );
    } else {
      // If there are still users left, emit the updated session to those remaining
      io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
    }
  }
};

export {
  handleSessionJoin,
  updateUserAttribute,
  handleStartSessionCountdown,
  handleSessionLeave,
};

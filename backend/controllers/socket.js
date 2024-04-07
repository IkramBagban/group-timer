import sendNotication from "../utils/sendNotification.js";

const handleSocketEvents = (io, sessions) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("doesSessionExist", (sessionCode) => {
      const sessionExists = !!sessions[sessionCode];
      socket.emit("isExistingSession", sessionExists);
    });

    socket.on("createSession", ({ sessionCode, userDetail }) => {
      if (!sessions[sessionCode]) {
        sessions[sessionCode] = { users: [], sessionActive: false };
      }
      addUserToSession(sessionCode, userDetail, socket);
    });

    socket.on("userReady", ({ sessionCode, userId }) => {
      updateUserReady(sessionCode, userId);
    });
    socket.on("updateAppState", ({ sessionCode, userId, appState }) => {
      const session = sessions[sessionCode];
      if (session) {
        const userIdx = session.users.findIndex(
          (user) => user.userId === userId
        );
        if (userIdx !== -1) {
          sessions[sessionCode].users[userIdx].appState = appState;
          io.to(sessionCode).emit("sessionUpdate", session.users);
        }
      }
    });

    socket.on("startSession", (sessionCode) => {
      startSessionCountdown(sessionCode, socket);
    });

    socket.on("removeFromSession", (sessionCode, socketId) => {
      removeUserFromSession(sessionCode, socketId);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  const addUserToSession = (sessionCode, userDetail, socket) => {
    sessions[sessionCode].users.push({ ...userDetail, socketId: socket.id });
    socket.join(sessionCode);
    io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
  };

  const updateUserReady = (sessionCode, userId) => {
    const session = sessions[sessionCode];
    if (session) {
      const user = session.users.find((user) => user.userId === userId);
      if (user) {
        user.isReady = true;
        io.to(sessionCode).emit("sessionUpdate", session.users);
      }
    }
  };

  const startSessionCountdown = (sessionCode, socket) => {
    const session = sessions[sessionCode];
    if (!session || !session.users.every((user) => user.isReady)) {
      console.log("Session not ready or does not exist.");
      return;
    }

    session.users.sort((a, b) => b.totalTime - a.totalTime);
    socket.to(sessionCode).emit("startingSession", session.users[0]);

    let remainingTime = session.users[0].totalTime + 5; // Add buffer for notification

    const countdownInterval = setInterval(() => {
      remainingTime--;

      for (let user of session?.users) {
        if (remainingTime === 0) {
          if (!session.sessionEnded) {
            session.users.forEach((user) => {
              if (user?.appState === "background") {
                sendNotication(
                  user.pushToken?.data,
                  "Timer Complete",
                  "Your timer has been completed."
                );
              }
            });
            session.sessionEnded = true;
          }
          clearInterval(countdownInterval);
          setTimeout(() => delete sessions[sessionCode], 5000); // 5000 milliseconds = 5 seconds
          return;
        }

        // Notify user 5 seconds before their countdown starts
        if (remainingTime - 1 - user.totalTime === 5) {
          if (user?.appState === "background") {
            sendNotication(
              user.pushToken.data,
              "Alert",
              "Your timer will start after 5 seconds."
            );
          }
        }
        // Adjust user's totalTime as the session countdown progresses
        if (remainingTime <= user.totalTime) user.totalTime--;
      }
      io.to(sessionCode).emit("sessionUpdate", session.users);
    }, 1000);
  };

  const removeUserFromSession = (sessionCode, socketId) => {
    if (sessions[sessionCode]) {
      sessions[sessionCode].users = sessions[sessionCode].users.filter(
        (user) => user.socketId !== socketId
      );
      io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
    }
  };
};

export default handleSocketEvents;

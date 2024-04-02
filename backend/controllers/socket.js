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
    session.users.sort((a, b) => b.totalTime - a.totalTime);

    socket.to(sessionCode).emit("startingSession", session.users[0]);
    const firstUser = session?.users[0];
    let time = firstUser.totalTime + 5;
    if (session && session.users?.every((user) => user.isReady)) {
      session.sessionActive = true;

      const countdownInterval = setInterval(() => {
        console.log("time => " + time);
        time = time - 1;
        for (let user of session?.users) {
          if (firstUser.totalTime + 1 === 0) {
            clearInterval(countdownInterval);
            if (!session.sessionEnded) {
              io.to(sessionCode).emit("sessionEnded", session.users);
              session.sessionEnded = true;
            }
            setTimeout(() => {
              delete sessions[sessionCode]; // Removes the session
              console.log(`Session ${sessionCode} removed after ending.`);
            }, 3000); // 3000 milliseconds = 3 seconds
            return;
          }

          if (time - user.totalTime === 5) {
            io.to(sessionCode).emit("sendNotification", user);
          }

          if (user.totalTime - 1 === time) {
            user.totalTime--;
          }
        }
        io.to(sessionCode).emit("sessionUpdate", session.users);
      }, 1000);
    }
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

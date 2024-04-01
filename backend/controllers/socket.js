const handleSocketEvents = (io, sessions) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("doesSessionExist", (sessionCode) => {
      const sessionExists = !!sessions[sessionCode];
      socket.emit("isExistingSession", sessionExists);
    });

    socket.on("createSession", ({ sessionCode, userDetail }) => {
      if (!sessions[sessionCode]) {
        // sessions[sessionCode] = { users: [], sessionActive: false };
        sessions[sessionCode] = { users: [] };
      }
      addUserToSession(sessionCode, userDetail, socket);
      console.log('creted session', sessions[sessionCode])
    });

    socket.on("updateUser", ({ sessionCode, userDetail }) => {
      // if (!userDetail.userId || !sessionCode || !sessions[sessionCode]) {
      //   console.log("There is some error while updating user.");
      //   return 
      // }
      console.log('user', userDetail)

      let userIdx = sessions[sessionCode].users.findIndex(
        (user) => user.userId === userDetail.userId
      );
      console.log('userIdx', userIdx)
      if (userIdx !== -1) {
        // console.log('before', sessions[sessionCode].users[userIdx])
        sessions[sessionCode].users[userIdx] =userDetail;
        // console.log('after', sessions[sessionCode].users[userIdx])
        io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
      }
      console.log('updated session', sessions[sessionCode])
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

    setTimeout(() => {
      if (session && session.users?.every((user) => user.isReady)) {
        // session.sessionActive = true;

        const countdownInterval = setInterval(() => {
          let allDone = true;
          for (let user of session?.users) {
            if (user.totalTime <= 0) {
              return clearInterval(countdownInterval);
            }
            const firstUser = session?.users[0];
            if (firstUser.totalTime === 0) {
              clearInterval(countdownInterval);
              io.to(sessionCode).emit("sessionEnded", session?.users);
            }

            if (firstUser.totalTime - user.totalTime === 5) {
              io.to(sessionCode).emit("sendNotification", user);
            }

            if (
              user.totalTime - 1 === firstUser.totalTime ||
              user.userId === firstUser.userId
            ) {
              user.totalTime--;
              allDone = false;
            }
          }
          io.to(sessionCode).emit("sessionUpdate", session.users);

          if (allDone) {
            clearInterval(countdownInterval);
            io.to(sessionCode).emit("sessionEnded", session.users);
          }
        }, 1000);
      }
    }, 5000);
  };

  const removeUserFromSession = (sessionCode, socketId) => {

    console.log('remove socketId', socketId)
    if (sessions[sessionCode]) {
      sessions[sessionCode].users = sessions[sessionCode].users.filter(
        (user) => user.socketId !== socketId
      );
      io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
    }
  };
};

export default handleSocketEvents;

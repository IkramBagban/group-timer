import sendNotication from "../utils/sendNotification.js";

const handleSocketEvents = (io, sessions) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("doesSessionExist", (sessionCode) => {
      const sessionExists = !!sessions[sessionCode];
      socket.emit("isExistingSession", sessionExists);
    });

    socket.on("createSession", ({ sessionCode, userDetail }) => {
      console.log('create session')
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

    socket.on("completionNotification", ({ pushToken, title, body }) => {
       sendNotication(pushToken?.data, title, body);
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
          clearInterval(countdownInterval);
          if (!session.sessionEnded) {
            io.to(sessionCode).emit("sessionEnded", session.users);
            // socket.on("completionNotification", ({ pushToken, title, body }) =>{
            //   sendNotication(pushToken?.data, title, body)}
            // );
            session.sessionEnded = true;
          }
          setTimeout(() => delete sessions[sessionCode], 5000); // 5000 milliseconds = 5 seconds
          return;
        }

        // Notify user 5 seconds before their countdown starts
        if (remainingTime - 1 - user.totalTime === 5) {
          // console.log("user.pus", user.pushToken.data);
          // sendNotication(
          //   user.pushToken.data,
          //   "this dummy title",
          //   "this is dummy body"
          //   );
          // io.to(sessionCode).emit("sendNotification", user);
          io.to(sessionCode).emit("readyToSendNotification", user);
          console.log("Ready?");
          socket.on("alertNotification", ({ pushToken, title, body }) => {
            console.log("sending notification to => ", pushToken, title, body);
            sendNotication(user.pushToken.data, title, body);
          });
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

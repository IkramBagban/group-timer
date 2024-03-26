import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 2300;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());

const sessions = {};

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("doesSessionExist", (sessionCode) => {
    if (!sessions[sessionCode]) {
      socket.emit("isExistingSession", false);
    } else {
      socket.emit("isExistingSession", true);
    }
  });

  socket.on("createSession", ({ sessionCode, userDetail }) => {
    if (!sessions[sessionCode]) {
      sessions[sessionCode] = { users: [], sessionActive: false };
    }
    // Add user to the session's user list
    sessions[sessionCode].users.push({ ...userDetail, socketId: socket.id });
    // Join the socket to a room named after the session code
    socket.join(sessionCode);
    // Emit an update to all clients in the session
    io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
  });

  socket.on("userReady", ({ sessionCode, userId }) => {
    const session = sessions[sessionCode];
    if (session) {
      const user = session.users.find((user) => user.userId === userId);
      if (user) {
        user.isReady = true;
        io.to(sessionCode).emit("sessionUpdate", session.users);
      }
    }
  });

  socket.on("startSession", (sessionCode) => {
    const session = sessions[sessionCode];
    // console.log("session 1", session);
    // session.users.sort((a, b) => a.totalTime - b.totalTime);
    session.users.sort((a, b) => b.totalTime - a.totalTime);
    // console.log("session 2", session);

    socket.to(sessionCode).emit('startingSession', session.users[0])

    setTimeout(() => {
      

    if (session && session.users?.every((user) => user.isReady)) {
      session.sessionActive = true;

      const countdownInterval = setInterval(() => {
        let allDone = true;
        for (let user of session?.users) {

          if(user.totalTime <= 0) return clearInterval(countdownInterval)
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
  });
  socket.on("removeFromsession", (sessionCode, socketId) => {
    if (sessions[sessionCode]) {
        sessions[sessionCode].users = sessions[sessionCode].users.filter(
            (user) => user.socketId !== socketId
        );
        io.to(sessionCode).emit("sessionUpdate", sessions[sessionCode].users);
    }
});


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res) => {
  res.send("Welcome to the chat app server");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

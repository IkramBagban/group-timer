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
    if (session && session.users.every((user) => user.isReady)) {
      session.sessionActive = true;

      io.to(sessionCode).emit("sessionStarted", session);
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

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import handleSocketEvents from "./controllers/socket.js";

const app = express();
const PORT = process.env.PORT || 2300;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const sessions = {};

handleSocketEvents(io, sessions);

app.use((req, res) => {
  res.send("Welcome to the chat app server");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

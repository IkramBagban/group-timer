import express from "express";
import { createServer } from "http";
import {Expo} from "expo-server-sdk";
import { Server } from "socket.io";
import cors from "cors";
import handleSocketEvents from "./controllers/socket.js";

const app = express();
let expo = new Expo();
const PORT = process.env.PORT || 2300;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const sessions = {};

handleSocketEvents(io, sessions)


app.post('/send-notification', async (req, res) => {
    const { pushToken, title, body } = req.body;
  
    // Validation for push token
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return res.status(400).send(`Invalid push token: ${pushToken}`);
    }
  
    // Create the messages that you want to send to clients
    let messages = [{
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: { test: 'data' },
    }];
  
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log(ticketChunk);
      res.status(200).send("Notification sent successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending notification.");
    }
  });

app.use((req, res) => {
  res.send("Welcome to the chat app server");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// const express = require('express');
// const { Expo } = require('expo-server-sdk');

import {Expo} from "expo-server-sdk";
import express from "express";
// Create a new Expo SDK client
let expo = new Expo();

const app = express();
app.use(express.json());

console.log('not')
app.post('/send-notification', async (req, res) => {
//   const { pushToken, title, body } = req.body;

//   const pushToken = 'ExponentPushToken[L3bfkJJ98BQbt_SaQIccCB]'
//   const title = "Dummy Title"
//   const body = "Dummy body"


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
    data: { withSome: 'data' },
    content_available: true,
        priority: "high",
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// ----------------
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
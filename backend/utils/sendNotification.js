import { Expo } from "expo-server-sdk";
import { connect } from "http2";
let expo = new Expo();

const sendNotication = async (pushToken, title, body) => {
  console.log("helo");
  let messages = [];
  try {
    // Validation for push token
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return console.log(`Invalid push token: ${pushToken}`);
    }

    // Create the messages that you want to send to clients
    messages = [
      {
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
        data: { test: "data" },
        content_available: true,
        priority: "high",
      },
    ];
  } catch (e) {
    console.log("e", e);
  }

  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log("ticketChunk", ticketChunk);
    // res.status(200).send("Notification sent successfully.");
  } catch (error) {
    console.error(error);
    // res.status(500).send("Error sending notification.");
  }
};

export default sendNotication;

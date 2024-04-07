import { Expo } from "expo-server-sdk";

const expo = new Expo();

/**
 * Sends a push notification to a specified device using Expo's push notification service.
 *
 * @param {string} pushToken - The Expo push token associated with the device to receive the notification.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body text of the notification.
 */

const sendNotication = async (pushToken, title, body) => {
  try {
    // Validation for push token
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Invalid Expo push token: ${pushToken}`);
      return;
    }
    const messages = [
      {
        to: pushToken,
        sound: "default", // default notification sound
        title,
        body,
        content_available: true,
        priority: "high",
      },
    ];

    await expo.sendPushNotificationsAsync(messages);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export default sendNotication;

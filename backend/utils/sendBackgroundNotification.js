import sendNotication from "./sendNotification.js";

export const notifyUserIfBackground = (user, title, message) => {
  if (user?.appState === "background") {
    sendNotication(user.pushToken?.data, title, message);
  }
};

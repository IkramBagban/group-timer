
import * as Notifications from "expo-notifications";

export function sendNotificationHandler(title,body,data,seconds) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: {
        seconds: seconds || 1,
      },
    });
  }
import * as Notifications from "expo-notifications";

const useNotification = () => {
  const sendNotification = async (title, body, data, seconds) => {
    try {
      const response = await Notifications.scheduleNotificationAsync({
        content: { title, body, data },
        trigger: seconds ? { seconds: seconds } : null,
      });
      // console.log("response", response);
    } catch (e) {
      // console.log("error in useNotification hook", e);
    }
  };
  return sendNotification;
};

export default useNotification;

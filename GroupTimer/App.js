import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import StackNavigations from "./src/Navigations/StackNavigations";
import { NavigationContainer } from "@react-navigation/native";
import Config from "react-native-config";
import io from "socket.io-client";
// import { useSocket } from "./src/hooks/useSocket";
import { SocketProvider, useSocket } from "./src/Context/SocketContext";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
 const socket = useSocket()
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Push Notifications need the appropriate permissions."
        );
        return;
      }
      console.log("1");
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log("2");
      console.log("Push TOken Data", pushTokenData);
      console.log("3");
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notifications) => {
        // console.warn("Notifications");
        // console.warn(notifications);
        const userName = notifications.request.content.data.userName;
        // console.warn("notification1 username -->" + userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Response Recieved");
        // console.log(response)
        const userName = response.notification.request.content.data.userName;
        console.log("notification2 username -->" + userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);
  // console.log(Config.BASE_URL);
  // scheduleNotificationHandler()
  return (
    <SocketProvider>

    <NavigationContainer>
      <StackNavigations />
    </NavigationContainer>
    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

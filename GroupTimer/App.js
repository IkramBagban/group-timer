import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import StackNavigations from "./src/Navigations/StackNavigations";
import { NavigationContainer } from "@react-navigation/native";
import { SocketProvider } from "./src/Context/SocketContext";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
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
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotifications();
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer>
        <StackNavigations />
      </NavigationContainer>
    </SocketProvider>
  );
}

import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import StackNavigations from "./src/Navigations/StackNavigations";
import { NavigationContainer } from "@react-navigation/native";
import { SocketProvider } from "./src/Context/SocketContext";
import {
  PushTokenProvider,
  usePushToken,
} from "./src/Context/PushTokenContext";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
      priority: 'high',
    };
  },
});

export default function App() {

  return (
    <PushTokenProvider>
      <SocketProvider>
        <Main />
      </SocketProvider>
    </PushTokenProvider>
  );
}

const Main = () => {  
  
  const { setPushToken } = usePushToken();
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Initial permission status:", status);
      let finalStatus = status;

      if (finalStatus !== "granted") {
        console.log("Requesting permissions...");
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
        finalStatus = status;
        
        console.log("New permission status:", status);
      }
      if (finalStatus !== "granted") {
        console.log("Permissions not granted. Showing alert.");
        Alert.alert(
          "Permission Required",
          "Push Notifications need the appropriate permissions."
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      setPushToken(pushTokenData);
      console.log("token", pushTokenData);
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          // importance: Notifications.AndroidImportance.DEFAULT,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
    }
    configurePushNotifications();


     // Add listener for received notifications
     const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    // Add listener for notification response (e.g., user tapping on notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received:", response);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  return (
    <NavigationContainer>
      <StackNavigations />
    </NavigationContainer>
  );
};

// import React, { useEffect } from 'react';
// // Import necessary modules and components
// import * as Notifications from 'expo-notifications';
// import { Alert, Platform } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import StackNavigations from './src/Navigations/StackNavigations';
// import { SocketProvider } from './src/Context/SocketContext';

// // Configure how notifications are handled when the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowAlert: true,
//   }),
// });

// export default function App() {
//   // Use effect to configure push notifications when component mounts
//   useEffect(() => {
//     // Function to configure push notifications
//     async function configurePushNotifications() {
//       // Get current notification permissions status
//       let { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       // Request notification permissions if not already granted
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync({
//           ios: {
//             allowAlert: true,
//             allowBadge: true,
//             allowSound: true,
//           },
//         });
//         finalStatus = status;
//       }

//       // Alert user if notification permissions are not granted
//       if (finalStatus !== 'granted') {
//         Alert.alert(
//           "Permission Required",
//           "Push Notifications need the appropriate permissions."
//         );
//         return;
//       }

//       // Get the Expo push token for the device
//       const pushTokenData = await Notifications.getExpoPushTokenAsync();

//       // Set notification channel for Android devices
//       if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.DEFAULT,
//         });
//       }
//     }

//     // Call the function to configure push notifications
//     configurePushNotifications();
//   }, []);

//   // Return the main component structure
//   return (
//     <SocketProvider>
//       <NavigationContainer>
//         <StackNavigations />
//       </NavigationContainer>
//     </SocketProvider>
//   );
// }

// // import { Alert, Platform } from "react-native";
// // import * as Notifications from "expo-notifications";
// // import { useEffect } from "react";
// // import StackNavigations from "./src/Navigations/StackNavigations";
// // import { NavigationContainer } from "@react-navigation/native";
// // import { SocketProvider } from "./src/Context/SocketContext";

// // Notifications.setNotificationHandler({
// //   handleNotification: async () => {
// //     return {
// //       shouldPlaySound: true,
// //       shouldSetBadge: false,
// //       shouldShowAlert: true,
// //     };
// //   },
// // });

// // export default function App() {
// //   useEffect(() => {
// //     async function configurePushNotifications() {
// //       const { status } = await Notifications.getPermissionsAsync();
// //       let finalStatus = status;

// //       if (finalStatus !== "granted") {
// //         const { status } = await Notifications.requestPermissionsAsync();
// //         finalStatus = status;
// //       }
// //       if (finalStatus !== "granted") {
// //         Alert.alert(
// //           "Permission Required",
// //           "Push Notifications need the appropriate permissions."
// //         );
// //         return;
// //       }
// //       const pushTokenData = await Notifications.getExpoPushTokenAsync();
// //       if (Platform.OS === "android") {
// //         Notifications.setNotificationChannelAsync("default", {
// //           name: "default",
// //           importance: Notifications.AndroidImportance.DEFAULT,
// //         });
// //       }
// //     }
// //     configurePushNotifications();
// //   }, []);

// //   return (
// //     <SocketProvider>
// //       <NavigationContainer>
// //         <StackNavigations />
// //       </NavigationContainer>
// //     </SocketProvider>
// //   );
// // }

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
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
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

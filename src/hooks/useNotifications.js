import * as Notifications from 'expo-notifications';

const useNotification = () => {
    const sendNotification = (title, body, data) => {
        Notifications.scheduleNotificationAsync({
            content: { title, body, data },
            trigger: { seconds: 0.1 },
        });
    };
    return sendNotification;
};


export default useNotification;
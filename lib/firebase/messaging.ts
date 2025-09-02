import { getMessaging } from "@/firebase";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BKFCE_a-zeTef9hO5Jfwx40gRHgVhRRbc6JMy8Epxc8toQnmXVljpXtUdYzifoY1KfoaEa54mi_LyLyLVj4JHK2w";

export const requestForToken = async () => {
  try {
    const messaging = getMessaging();
    if (!messaging) {
      console.warn("Firebase messaging is not initialized yet");
      return null;
    }
    
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      // Send this token to your server and save it for the user
      return currentToken;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getMessaging();
    if (!messaging) {
      console.warn("Firebase messaging is not initialized yet");
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
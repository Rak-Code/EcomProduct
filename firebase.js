// src/lib/firebase/config.ts 
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCi25bNd3_5rqthI7ojqJDmmVap91TzEA0",
  authDomain: "pariboto-e5fe2.firebaseapp.com",
  projectId: "pariboto-e5fe2",
  storageBucket: "pariboto-e5fe2.firebasestorage.app",
  messagingSenderId: "1067981373797",
  appId: "1:1067981373797:web:f55025fe1eacb9c367e18c",
  measurementId: "G-3LCNHX3H6C"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize messaging only in browser environment and with proper error handling
let messaging = null;
if (typeof window !== 'undefined') {
  // Use dynamic import with proper error handling instead of require
  import('firebase/messaging')
    .then(({ getMessaging }) => {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.warn('Firebase messaging initialization failed:', error.message);
      }
    })
    .catch(error => {
      console.warn('Firebase messaging module import failed:', error.message);
    });
}

// Export messaging as a getter function to avoid undefined issues
export { app, auth, db };
export const getMessaging = () => messaging;
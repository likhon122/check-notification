import React, { useEffect } from "react";
import axios from "axios";

// Replace with your actual VAPID public key
const PUBLIC_VAPID_KEY = import.meta.env.VAPID_PUBLIC_KEY;

const App = () => {
  useEffect(() => {
    // Check if browser supports service workers and push notifications
    if ("serviceWorker" in navigator && "PushManager" in window) {
      askForNotificationPermission();
    }
  }, []);

  // Function to ask user for notification permissions and subscribe
  const askForNotificationPermission = async () => {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Required to show notifications
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      // Send subscription details to the backend server
      await axios.post("/subscribe", subscription);

      console.log("User is subscribed to push notifications.");
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
    }
  };

  // Convert VAPID key from Base64 to UInt8Array (required by Web Push API)
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return <div>App with Push Notifications</div>;
};

export default App;

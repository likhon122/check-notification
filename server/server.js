const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
require("dotenv").config(); // For environment variables

const app = express();
app.use(bodyParser.json());

// Set VAPID details
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY, // VAPID Public Key
  process.env.VAPID_PRIVATE_KEY // VAPID Private Key
);

// Store subscriptions (in production, use a database)
let subscriptions = [];

// Route to save push subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Save the subscription to send notifications later
  res.status(201).json({});
});

// Route to trigger push notification (send when a new chat message arrives)
app.post("/notify", (req, res) => {
  const { title, message } = req.body; // Custom title and message
  const notificationPayload = {
    title: title,
    body: message
  };

  const promises = subscriptions.map((sub) => {
    return webpush.sendNotification(sub, JSON.stringify(notificationPayload));
  });

  Promise.all(promises)
    .then(() =>
      res.status(200).json({ message: "Notifications sent successfully." })
    )
    .catch((err) => {
      console.error("Error sending notification:", err);
      res.sendStatus(500);
    });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleMessage } from "./bot.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "chuu_chicken_verify_2024";
const PORT = process.env.PORT || 3000;

// Webhook verification (Facebook GET request)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    console.log("Webhook verification failed");
    res.sendStatus(403);
  }
});

// Webhook receive (Facebook POST request)
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const event = entry.messaging?.[0];
      if (!event) continue;

      const senderId = event.sender.id;

      // Текст мессеж ирвэл
      if (event.message && event.message.text) {
        const messageText = event.message.text;
        console.log(`Message from ${senderId}: ${messageText}`);

        try {
          await handleMessage(senderId, messageText);
        } catch (error) {
          console.error("Error handling message:", error);
        }
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => {
  res.send("CHUU CHICKEN Bot is running 🐔");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

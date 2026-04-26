const express = require("express");
const app = express();
app.use(express.json());

const { handleMessage } = require("./bot");

// ✅ Facebook Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook баталгаажлаа");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Facebook мессеж хүлээн авах
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const event = entry.messaging?.[0];
      if (!event) continue;

      const senderId = event.sender?.id;
      const messageText = event.message?.text;

      if (senderId && messageText) {
        console.log(`📩 Ирсэн мессеж [${senderId}]: ${messageText}`);
        await handleMessage(senderId, messageText);
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => res.send("🐔 Chuu Chicken Bot ажиллаж байна!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server port ${PORT} дээр ажиллаж байна`));

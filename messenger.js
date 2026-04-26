const axios = require("axios");

async function sendMessage(recipientId, text) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: "RESPONSE",
      }
    );
    console.log(`✅ Мессеж явуулагдлаа → ${recipientId}`);
  } catch (err) {
    console.error("❌ Мессеж явуулах алдаа:", err.response?.data || err.message);
  }
}

module.exports = { sendMessage };

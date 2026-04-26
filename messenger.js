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

async function getUserName(userId) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v18.0/${userId}?fields=name&access_token=${PAGE_ACCESS_TOKEN}`
    );
    return res.data.name || "";
  } catch (err) {
    console.error("❌ Нэр авах алдаа:", err.response?.data || err.message);
    return "";
  }
}

module.exports = { sendMessage, getUserName };

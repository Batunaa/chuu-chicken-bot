const axios = require("axios");

async function sendOrderToGroup(orderDetails) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  const GROUP_THREAD_ID = process.env.GROUP_THREAD_ID;

  const now = new Date();
  const timeStr = now.toLocaleString("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });

  const orderMessage =
    `🆕 ШИНЭ ЗАХИАЛГА — ${timeStr}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 Захиалга:\n${orderDetails.items}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 Нийт дүн: ${orderDetails.total}\n` +
    `📞 Утас: ${orderDetails.customerPhone}\n` +
    `📍 Хаяг: ${orderDetails.customerAddress}\n` +
    `━━━━━━━━━━━━━━━━━━━━`;

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/t_${GROUP_THREAD_ID}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      { message: orderMessage }
    );
    console.log("✅ Захиалга group chat-руу явуулагдлаа");
  } catch (err) {
    console.error("❌ Group chat алдаа:", err.response?.data || err.message);
  }
}

module.exports = { sendOrderToGroup };

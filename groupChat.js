import axios from "axios";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const GROUP_THREAD_ID = process.env.GROUP_THREAD_ID;
const GRAPH_API = "https://graph.facebook.com/v18.0";

// Group chat руу захиалгын мэдээлэл явуулах
export async function sendOrderToGroup(orderDetails, customerName = "") {
  if (!GROUP_THREAD_ID || GROUP_THREAD_ID === "0") {
    console.log("GROUP_THREAD_ID тохируулаагүй байна, group chat руу явуулсангүй");
    return;
  }

  try {
    const itemsList = orderDetails.items
      .map((item) => `• ${item.name} x${item.qty} - ₮${item.price.toLocaleString()}`)
      .join("\n");

    const orderMessage = `🐔 ШИНЭ ЗАХИАЛГА\n\n` +
      `👤 Захиалагч: ${customerName || "—"}\n` +
      `📞 Утас: ${orderDetails.phone || "—"}\n` +
      `📍 Хаяг: ${orderDetails.address || "—"}\n\n` +
      `📝 Захиалга:\n${itemsList}\n\n` +
      `💰 Нийт дүн: ₮${orderDetails.total.toLocaleString()}`;

    const response = await axios.post(
      `${GRAPH_API}/t_${GROUP_THREAD_ID}`,
      { message: orderMessage },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );

    console.log("Order sent to group chat");
    return response.data;
  } catch (error) {
    console.error("Error sending order to group:", error.response?.data || error.message);
  }
}

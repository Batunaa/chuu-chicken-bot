import axios from "axios";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const GRAPH_API = "https://graph.facebook.com/v18.0";

// Хэрэглэгч рүү мессеж явуулах
export async function sendMessage(recipientId, messageText) {
  try {
    const response = await axios.post(
      `${GRAPH_API}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: messageText },
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
      }
    );
    console.log(`Message sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}

// Хэрэглэгчийн нэрийг авах
export async function getUserName(userId) {
  try {
    const response = await axios.get(`${GRAPH_API}/${userId}`, {
      params: {
        fields: "first_name,last_name",
        access_token: PAGE_ACCESS_TOKEN,
      },
    });
    const { first_name, last_name } = response.data;
    return `${first_name || ""} ${last_name || ""}`.trim();
  } catch (error) {
    console.error("Error getting user name:", error.response?.data || error.message);
    return "";
  }
}

import { generateResponse } from "./ai.js";
import { sendMessage, getUserName } from "./messenger.js";
import { sendOrderToGroup } from "./groupChat.js";

// Хэрэглэгчдийн харилцааны түүхийг хадгалах
const conversations = new Map();

export async function handleMessage(senderId, messageText) {
  // Хэрэглэгчийн нэрийг авах
  const userName = await getUserName(senderId);

  // Өмнөх харилцааны түүх
  const history = conversations.get(senderId) || [];

  // AI хариулт авах
  const aiResponse = await generateResponse(messageText, history, userName);

  // Хариултыг хэрэглэгч рүү явуулах
  if (aiResponse.message) {
    await sendMessage(senderId, aiResponse.message);
  }

  // Харилцааны түүхэд нэмэх
  history.push({ role: "user", content: messageText });
  history.push({ role: "assistant", content: aiResponse.message });

  // Сүүлийн 20 мессежийг л хадгалах (memory хэмнэх)
  if (history.length > 20) {
    history.splice(0, history.length - 20);
  }
  conversations.set(senderId, history);

  // Захиалга бүрэн бол group chat руу мэдэгдэх
  if (aiResponse.hasOrder && aiResponse.orderDetails) {
    try {
      await sendOrderToGroup(aiResponse.orderDetails, userName);
    } catch (error) {
      console.error("Error sending to group chat:", error);
    }
  }
}

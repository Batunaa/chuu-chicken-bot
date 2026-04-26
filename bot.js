const { getAIReply } = require("./ai");
const { sendMessage } = require("./messenger");
const { sendOrderToGroup } = require("./groupChat");
const { getUserName } = require("./messenger");

const conversations = {};

async function handleMessage(senderId, userMessage) {
  try {
    if (!conversations[senderId]) {
      conversations[senderId] = {
        history: [],
        state: "new",
        customerName: "",
        orderData: null,
      };
    }

    const conv = conversations[senderId];

    // Хэрэглэгчийн нэрийг нэг удаа авна
    if (!conv.customerName) {
      conv.customerName = await getUserName(senderId);
    }

    conv.history.push({ role: "user", content: userMessage });

    const aiResponse = await getAIReply(conv.history, conv.customerName);

    // JSON хариулт шалгах
    let parsed;
    let replyText;
    try {
      parsed = JSON.parse(aiResponse);
      replyText = parsed.message || aiResponse;
    } catch {
      parsed = null;
      replyText = aiResponse;
    }

    conv.history.push({ role: "assistant", content: replyText });

    // Хэрэглэгч рүү зөвхөн message текст явуулна (JSON биш)
    await sendMessage(senderId, replyText);

    // Захиалга group chat руу явуулах
    if (parsed && parsed.action === "SEND_ORDER_TO_GROUP" && parsed.orderDetails) {
      parsed.orderDetails.customerName = conv.customerName;
      await sendOrderToGroup(parsed.orderDetails);
      console.log(`✅ Захиалга group chat-руу явуулагдлаа: ${senderId}`);
    }

    // 24 цагийн дараа цэвэрлэх
    setTimeout(() => {
      delete conversations[senderId];
    }, 24 * 60 * 60 * 1000);

  } catch (err) {
    console.error("❌ handleMessage алдаа:", err);
    await sendMessage(senderId, "Уучлаарай, түр саатал гарлаа. 8857-6655 дугаарт залгана уу!");
  }
}

module.exports = { handleMessage };

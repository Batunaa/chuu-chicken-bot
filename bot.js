const { getAIReply } = require("./ai");
const { sendMessage } = require("./messenger");
const { sendOrderToGroup } = require("./groupChat");

// Хэрэглэгч тус бүрийн харилцааны түүхийг хадгалах
const conversations = {};

async function handleMessage(senderId, userMessage) {
  try {
    // Шинэ хэрэглэгч бол инициализаци хийх
    if (!conversations[senderId]) {
      conversations[senderId] = {
        history: [],
        state: "new", // new | greeted | menu_sent | ordering | address | done
        orderData: null,
      };
    }

    const conv = conversations[senderId];
    conv.history.push({ role: "user", content: userMessage });

    // AI-аас хариулт авах
    const aiResponse = await getAIReply(conv.history);

    // AI хариулт парс хийх (JSON + мессеж)
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = { message: aiResponse, action: null };
    }

    const replyText = parsed.message || aiResponse;
    const action = parsed.action || null;

    // Хариулт түүхэнд нэмэх
    conv.history.push({ role: "assistant", content: replyText });

    // Хэрэглэгч рүү мессеж явуулах
    await sendMessage(senderId, replyText);

    // Тусгай үйлдлүүд
    if (action === "SEND_ORDER_TO_GROUP" && parsed.orderDetails) {
      conv.state = "done";
      conv.orderData = parsed.orderDetails;
      await sendOrderToGroup(parsed.orderDetails);
      console.log(`✅ Захиалга group chat-руу явуулагдлаа: ${senderId}`);
    }

    // Хуучин харилцааг цэвэрлэх (24 цагийн дараа)
    setTimeout(() => {
      if (conversations[senderId]) {
        delete conversations[senderId];
        console.log(`🗑️ Харилцаа цэвэрлэгдлээ: ${senderId}`);
      }
    }, 24 * 60 * 60 * 1000);

  } catch (err) {
    console.error("❌ handleMessage алдаа:", err);
    await sendMessage(
      senderId,
      "Уучлаарай, түр саатал гарлаа. 8857-6655 дугаарт залгана уу!"
    );
  }
}

module.exports = { handleMessage };

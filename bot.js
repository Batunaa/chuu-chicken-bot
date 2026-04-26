const { getAIReply } = require("./ai");
const { sendMessage, getUserName } = require("./messenger");
const { sendOrderToGroup } = require("./groupChat");

const conversations = {};

async function handleMessage(senderId, userMessage) {
  try {
    if (!conversations[senderId]) {
      conversations[senderId] = {
        history: [],
        customerName: "",
        orderData: null,
      };
    }

    const conv = conversations[senderId];

    if (!conv.customerName) {
      conv.customerName = await getUserName(senderId);
    }

    conv.history.push({ role: "user", content: userMessage });

    const aiResponse = await getAIReply(conv.history, conv.customerName);

    let replyText = aiResponse;
    let orderDetails = null;

    // JSON байгаа эсэхийг шалгах — олон янзын байдлаар
    const jsonMatch = aiResponse.match(/\{[\s\S]*"action"\s*:\s*"SEND_ORDER_TO_GROUP"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        replyText = parsed.message || "";
        orderDetails = parsed.orderDetails;
      } catch (e) {
        // JSON parse алдаатай бол JSON хэсгийг огт харуулахгүй болгох
        replyText = aiResponse.replace(/\{[\s\S]*\}/, "").trim();
      }
    }

    // Хэрэв replyText хоосон бол захиалга авлаа гэж ойлгох
    if (!replyText) {
      replyText = "Захиалга бүртгэгдлээ. Амжилт хүсье 😇";
    }

    conv.history.push({ role: "assistant", content: replyText });

    await sendMessage(senderId, replyText);

    if (orderDetails) {
      orderDetails.customerName = conv.customerName;
      await sendOrderToGroup(orderDetails);
      console.log(`✅ Захиалга group chat-руу явуулагдлаа: ${senderId}`);
    }

    setTimeout(() => {
      delete conversations[senderId];
    }, 24 * 60 * 60 * 1000);

  } catch (err) {
    console.error("❌ handleMessage алдаа:", err);
    await sendMessage(senderId, "Уучлаарай, түр саатал гарлаа. 8857-6655 дугаарт залгана уу!");
  }
}

module.exports = { handleMessage };

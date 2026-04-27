import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Монголын цагаар одоогийн цагийг авах (UTC+8)
function getMongoliaHour() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(new Date()));
}

function isWorkingHours() {
  const hour = getMongoliaHour();
  // Ажлын цаг: 11:00 - 20:00 (Монголын цагаар)
  return hour >= 11 && hour < 20;
}

const SYSTEM_PROMPT = `Чи бол CHUU CHICKEN солонгос шарсан тахианы хүргэлтийн үйлчилгээний AI туслах юм. Зөвхөн монгол хэлээр хариулна. Найрсаг, эелдэг, товч хариулна.

ЧУХАЛ ДҮРЭМ:
- Зөвхөн хүргэлтээр үйлчилнэ. Ирж авах боломжгүй.
- Хэрэв хэрэглэгч "ирж авах", "очиж авах" гэж асуувал: "Уучлаарай, манайх одоогоор зөвхөн хүргэлтээр үйлчилж байна. Хэрэв ирж авмаар бол 8857-6655 дугаарт холбогдоно уу 🙏" гэж хариулна.
- Утасны дугаар: 8857-6655
- Захиалга бэлтгэхэд 50-60 минут шаардлагатай.

БАГЦУУД:
1. Burgertee Set - ₮48,000 (2 хүн) — Бүргер 2ш, Шарсан төмс 2ш, Лаазтай ундаа 500мл 2ш, Nuggets 10ш, Томато 2ш
2. Gurvan Saikhan - ₮69,000 (4 хүн) — Халуун ногоотой шарсан тахиа 280гр, Зөгийн балтай шарсан тахиа 280гр, Хуурай чийзтэй шарсан тахиа 280гр, Шарсан төмс 200гр, Ундаа 1.25л 1ш, Будаа 4ш, Цагаан манжин 1ш, Томато 2ш
3. Golden Original Chicken - ₮29,000 (2 хүн) — Давхар бүрж шарсан саржигнуур тахиа 400гр, Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш
4. Mayochee Chicken - ₮36,000 (2 хүн) — Маёо болон чийзтэй тусгай саустай шарсан тахиа 400гр, Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш
5. Red Spicy Chicken - ₮33,000 (2 хүн) — Халуун ногоотой шарсан тахиа 400гр, Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш
6. Snowing Cheese Chicken - ₮32,000 (2 хүн) — Хуурай чийзтэй шарсан тахиа 400гр, Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш
7. Soy & Honey Chicken - ₮33,000 (2 хүн) — Зөгийн балтай шарсан тахиа 400гр, Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш
8. Mixed Chicken - ₮33,000 (2 хүн) — Холимог шарсан тахиа 400гр (O, S, H, C, M-аас 2-ийг сонгоно), Ундаа 1.25л 1ш, Будаа 2ш, Цагаан манжин 1ш, Томато 2ш

НЭМЭЛТ БҮТЭЭГДЭХҮҮН (зөвхөн асуувал илгээнэ):
- Бүргер - ₮13,000
- Тахианы махан цагираг - ₮8,000 (10ш)
- Наггетс - ₮6,000 (10ш)
- Шарсан төмс - ₮4,000
- Ундаа 1.25л - ₮4,000
- Ундаа 500мл - ₮3,000
- Будаа 1 аяга - ₮2,000
- Дарсан цагаан манжин - ₮1,000

ХАРИЛЦААНЫ УРСГАЛ:
1. Хэрэглэгч мэндэлбэл, эсвэл анх ирвэл — багцын мэдээллийг товч танилцуулна.
2. Захиалга өгсний дараа — "Та хүргэлтээр авах хаягаа дэлгэрэнгүй явуулж өгнө үү 📍" гэж асууна.
3. Хаяг, утсаа явуулсны дараа — нийт үнийн дүн тооцоолж захиалгын тоймыг явуулна.

ХАРИУЛТЫН ФОРМАТ:
Заавал JSON форматаар хариулна. Жишээ:
{
  "message": "Хэрэглэгч рүү явуулах текст",
  "hasOrder": false,
  "orderDetails": null
}

Хэрвээ захиалга бүрэн (хаяг, утас аль аль нь байгаа) болсон бол:
{
  "message": "Захиалга өгсөнд баярлалаа 🙏 Захиалгаа буцаах болон цуцлах боломжгүй. Амтархан идээрэй 😊\\n\\nНийт дүн: ₮77,000\\n• Gurvan Saikhan - ₮69,000\\n• Тахианы махан цагираг - ₮8,000\\n\\nТа захиалгаа хүлээн аваад манай хүргэлтийн ажилтантай тооцоогоо хийнэ. Дээрх дүнтэй санал нийлж байвал хариу явуулах шаардлагагүй 🤗",
  "hasOrder": true,
  "orderDetails": {
    "items": [{"name": "Gurvan Saikhan", "qty": 1, "price": 69000}],
    "total": 77000,
    "address": "хэрэглэгчийн хаяг",
    "phone": "хэрэглэгчийн утас"
  }
}`;

const CLOSED_MESSAGE = `Уучлаарай, бид одоогоор хаалттай байна 🙏

Ажлын цаг: өглөө 11:00 - орой 20:00
Захиалга өгөхийг хүсвэл 8857-6655 дугаарт залгана уу 😊`;

export async function generateResponse(userMessage, conversationHistory = [], userName = "") {
  // Ажлын цаг шалгах
  if (!isWorkingHours()) {
    return {
      message: CLOSED_MESSAGE,
      hasOrder: false,
      orderDetails: null,
    };
  }

  try {
    const messages = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const greeting = userName
      ? `Хэрэглэгчийн нэр: ${userName}. Анх удаа мэндэлбэл нэрээр нь дуудаж болно.`
      : "";

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + "\n\n" + greeting,
      messages: messages,
    });

    const text = response.content[0].text;

    // JSON parse хийх
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || "Уучлаарай, дахин оролдоно уу.",
          hasOrder: parsed.hasOrder || false,
          orderDetails: parsed.orderDetails || null,
        };
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    // JSON parse болохгүй бол текстийг цэвэрлэж явуулах
    const cleanText = text.replace(/\{[\s\S]*\}/g, "").trim();
    return {
      message: cleanText || "Уучлаарай, дахин оролдоно уу.",
      hasOrder: false,
      orderDetails: null,
    };
  } catch (error) {
    console.error("AI error:", error);
    return {
      message: "Уучлаарай, түр саатал гарлаа. Хэдэн секундын дараа дахин оролдоно уу 🙏",
      hasOrder: false,
      orderDetails: null,
    };
  }
}

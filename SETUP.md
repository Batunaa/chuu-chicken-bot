# 🐔 CHUU CHICKEN Bot — Тохируулах заавар

## Шаардлагатай зүйлс
- Node.js 18+
- Facebook Developer Account
- Anthropic API key

---

## АЛХАМ 1 — Anthropic API key авах

1. https://console.anthropic.com → бүртгүүл
2. API Keys → Create Key
3. `.env` файлд `ANTHROPIC_API_KEY=...` гэж хадгал

---

## АЛХАМ 2 — Facebook App үүсгэх

1. https://developers.facebook.com → "My Apps" → "Create App"
2. "Business" сонгоно
3. App нэр: "ChuuChickenBot"
4. **Messenger** product нэмнэ → Settings → Access Tokens
5. Таны Page-ийг сонгоод → **Generate Token** → хуулж `.env`-д хадгал:
   ```
   PAGE_ACCESS_TOKEN=EAAxxxxx...
   ```

---

## АЛХАМ 3 — Сервер деплой (Railway — үнэгүй)

1. https://railway.app → GitHub-аар нэвтрэх
2. "New Project" → "Deploy from GitHub repo"
3. Кодоо GitHub-т push хийх:
   ```bash
   git init
   git add .
   git commit -m "Chuu Chicken Bot"
   git push
   ```
4. Railway → Variables tab-д `.env.example`-аас хуулаад утгуудаа оруулна
5. Deploy → URL авна: `https://chuu-chicken-bot.railway.app`

---

## АЛХАМ 4 — Webhook тохируулах

1. Facebook Developers → Messenger → Webhooks → "Add Callback URL"
2. **Callback URL**: `https://таны-railway-url.railway.app/webhook`
3. **Verify Token**: `chuu_chicken_verify_2024`
4. Subscribe: `messages`, `messaging_postbacks` сонгоно
5. Таны Page-ийг subscribe хийнэ

---

## АЛХАМ 5 — Group Thread ID авах

1. Захиалгын Messenger group chat-аа нееж
2. URL дахь дугаарыг хуулна:
   `https://www.messenger.com/t/`**`1234567890123456`**
3. `.env`-д хадгал:
   ```
   GROUP_THREAD_ID=1234567890123456
   ```

⚠️ Бот тэр group-т member байх ёстой!

---

## АЛХАМ 6 — Локал тест хийх (заавал биш)

```bash
npm install
cp .env.example .env
# .env файлд утгуудаа оруулна
npm start
```

Өөр terminal-д:
```bash
# ngrok суулгаад
ngrok http 3000
# гарах URL-ийг webhook-т ашиглана
```

---

## ✅ Систем яг ингэж ажиллана

```
Хэрэглэгч → мессеж бичнэ
    ↓
Facebook → таны серверт дамжуулна
    ↓
Claude AI → монголоор хариулт үүсгэнэ
    ↓
Хэрэглэгч рүү → хариулт явуулна
    ↓
Захиалга бүрэн болмогц →
    Хэрэглэгч рүү тооцоо явуулна +
    Group chat руу захиалгын дэлгэрэнгүй явуулна
```

---

## ❓ Асуудал гарвал

- Лог харах: Railway → Deployments → View Logs
- Facebook token дуусвал: Meta Developer → Regenerate Token
- Утас: 8857-6655


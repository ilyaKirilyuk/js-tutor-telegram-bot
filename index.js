require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { OpenAI } = require("openai");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Ты — ИИ-наставник по JavaScript, обучающий пользователей на русском языке.
Объясняй темы по шагам, давай примеры кода, предлагай задания.
Работай как репетитор: задавай вопросы, предлагай практику, поясняй ошибки.
Используй знания из "You Don’t Know JS", "Eloquent JavaScript", MDN.
`;

console.log("🤖 JavaScript Tutor Bot is running...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
    });

    const reply = response.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("Ошибка OpenAI:", err.message);
    bot.sendMessage(chatId, "⚠️ Произошла ошибка. Попробуй позже.");
  }
});

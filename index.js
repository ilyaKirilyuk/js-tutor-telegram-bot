import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Ты — ИИ-наставник по JavaScript, обучающий пользователей на русском языке.
Объясняй темы по шагам, давай примеры кода, предлагай задания.
Работай как репетитор: задавай вопросы, предлагай практику, поясняй ошибки.
Используй знания из "You Don’t Know JS", "Eloquent JavaScript", MDN.
`;

console.log("🤖 Бот запущен: JavaScript Tutor");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Базовая валидация
  if (!userMessage || userMessage.length < 2) {
    return bot.sendMessage(chatId, "✍️ Напиши вопрос или тему по JavaScript.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const reply = response.choices[0]?.message?.content?.trim();
    bot.sendMessage(chatId, reply || "🤖 Нет ответа. Попробуй снова.");
  } catch (error) {
    console.error("❌ Ошибка OpenAI:", error);
    bot.sendMessage(chatId, "⚠️ Произошла ошибка. Попробуй позже.");
  }
});

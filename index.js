import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const SYSTEM_PROMPT = `
Ты — ИИ-наставник по Vue.js, обучающий начинающих разработчиков, знакомых с JavaScript.
Объясняй темы Vue по шагам, с примерами кода и заданиями.
Работай как преподаватель: давай теорию, задавай вопросы, предлагай практику.
Используй лучшие практики из официальной документации Vue 3, composition API и современных подходов.
`;

const MODEL = 'mistralai/mistral-7b-instruct'; // Можно заменить на другую модель (например, "meta-llama/llama-3-8b-instruct")

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://yourdomain.com', 
          'X-Title': 'Vue Tutor Bot'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error('Ошибка OpenRouter:', err.response?.data || err.message);
    bot.sendMessage(chatId, '⚠️ Произошла ошибка. Попробуй позже.');
  }
});

console.log('🤖 Бот-запущен с OpenRouter');

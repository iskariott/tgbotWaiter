require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Змінна для збереження chatId
let chatId = null;

let lastMessageId = null;

const returnDate = new Date('2025-06-19T02:00:00');

// Функція для обчислення часу до повернення
function getTimeRemaining() {
    const now = new Date();
    const diff = returnDate - now;

    if (diff <= 0) {
        return '🎉 Ліза вже повернулася!';
    }

    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

    return `Лізка вдома через: ${days} днів, ${hours} годин 💙💛`;
}

// Бот реагує на нові повідомлення та зберігає chatId
bot.on('message', (msg) => {
    // Якщо chatId ще не визначено, зберігаємо його
    if (!chatId) {
        chatId = msg.chat.id;
    }
});

// Надсилає повідомлення щохвилини
setInterval(async () => {
    if (chatId) {
        const message = getTimeRemaining();
        try {
            if (lastMessageId) {
                await bot.deleteMessage(chatId, lastMessageId);
            }
            const sentMsg = await bot.sendMessage(chatId, message);
            lastMessageId = sentMsg.message_id;
        } catch (error) {
            console.error('Помилка при надсиланні повідомлення:', error.message);
        }
    }
}, 5000);

// Команда /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Бот активний! Чекаємо Лізу разом 💌');
});

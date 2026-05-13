import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN missing');
}

const bot = new TelegramBot(token);

export async function sendTelegramMessage(
    text: string
): Promise<void> {
    try {
        await bot.sendMessage(
            process.env.TELEGRAM_CHAT_ID!,
            text
        );
    } catch (err) {
        console.error(err);
    }
}

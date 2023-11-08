const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const { getWeatherData } = require('./utils/getWeatherData');
const { getWeatherEmoji } = require('./utils/getWeatherEmoji');
const { formatWeatherMessage } = require('./utils/formatWeatherMessage');

const app = express();
const port = process.env.PORT || 3000;

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'Welcome to the weather bot! Please enter the name of a city or share your location so I can give you the weather forecast.',
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Share Location',
              request_location: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

bot.on('text', async msg => {
  const chatId = msg.chat.id;
  const userMsg = msg.text;

  try {
    const weatherDataList = await getWeatherData(userMsg);
    let message = '';

    weatherDataList.forEach(weatherData => {
      const weatherEmoji = getWeatherEmoji(weatherData.weather);
      const formattedMessage = formatWeatherMessage(weatherData, weatherEmoji);
      message += `${weatherData.city}, ${weatherData.country}\n${formattedMessage}\n\n`;
    });

    try {
      await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    } catch (err) {
      logger.error('Failed to send message', err);
      bot.sendMessage(chatId, 'Invalid city name entered. Please try again.');
    }
  } catch (err) {
    logger.error('Invalid city name entered. Please try again.');
    bot.sendMessage(chatId, 'Invalid city name entered. Please try again.');
  }
});

bot.on('location', async msg => {
  const chatId = msg.chat.id;
  const latitude = msg.location.latitude;
  const longitude = msg.location.longitude;

  try {
    const weatherDataList = await getWeatherData(null, latitude, longitude);
    let message = '';

    weatherDataList.forEach(weatherData => {
      const weatherEmoji = getWeatherEmoji(weatherData.weather);
      const formattedMessage = formatWeatherMessage(weatherData, weatherEmoji);
      message += `${weatherData.city}, ${weatherData.country}\n${formattedMessage}\n\n`;
    });

    bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  } catch (err) {
    logger.error("The location you shared doesn't exist.");
    bot.sendMessage(chatId, "The location you shared doesn't exist.");
  }
});

app.listen(port, () => {
  logger.info('Server is running on port 3000');
});

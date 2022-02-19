'use strict';
const axios = require('axios');
require('dotenv').config();

module.exports.hello = async event => {
  console.log(event);
  const telegramBody = JSON.parse(event.body);
  const msg = telegramBody.message;
  const chatId = msg.chat.id;
  const text = msg.text;

  const regex = new RegExp(`/hello (.*)`);
  const captureGroups = text.match(regex);
  if (captureGroups && captureGroups.length > 1) {
    const value = captureGroups[1];
    try {
      const res = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: `Hello, ${value}!`
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ result: res.data })
      }
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: err })
      }
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ match: false })
    }
  }
};
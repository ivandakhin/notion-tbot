'use strict';
const axios = require('axios');
const dotenv = require('dotenv').config();
const { Client } = require("@notionhq/client");

const notion = new Client({
   auth: process.env.NOTION_ID
});

const databaseId = process.env.NOTION_DATABASE_ID

async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: { 
          title:[
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}


module.exports.hello = async event => {
  console.log(event);
  const telegramBody = JSON.parse(event.body);
  const msg = telegramBody.message;
  const chatId = msg.chat.id;
  const text = msg.text;
  
  try {
    const res = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: `DONE!`
    });
     
    addItem(text);
    
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
};

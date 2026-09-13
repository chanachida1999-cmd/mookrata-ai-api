const axios = require('axios');

const GRAPH_API_VERSION = 'v21.0';

function getPageAccessToken() {
  const token = process.env.PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new Error('PAGE_ACCESS_TOKEN is not set');
  }
  return token;
}

async function sendTextMessage(recipientId, text) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/messages`;
  await axios.post(
    url,
    {
      recipient: { id: recipientId },
      message: { text },
    },
    {
      params: { access_token: getPageAccessToken() },
    }
  );
}

module.exports = { sendTextMessage };

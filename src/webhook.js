const express = require('express');
const { sendTextMessage } = require('./facebook');

const router = express.Router();

// Facebook webhook verification (GET /webhook)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Facebook webhook events (POST /webhook)
router.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object !== 'page') {
    res.sendStatus(404);
    return;
  }

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const senderId = event.sender && event.sender.id;
      const messageText = event.message && event.message.text;

      if (senderId && messageText) {
        try {
          await sendTextMessage(senderId, `ได้รับข้อความแล้ว: ${messageText}`);
        } catch (err) {
          console.error('Failed to send message to Facebook:', err.message);
        }
      }
    }
  }

  res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;

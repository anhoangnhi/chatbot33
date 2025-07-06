const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { getQnAResponse } = require('./lib/googleSheet');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/webhook', async (req, res) => {
  const { message, user_id = 'unknown', platform = 'unknown' } = req.body;
  console.log(`[Webhook] Nhận từ ${platform} - ${user_id}: ${message}`);
  try {
    const response = await getQnAResponse(message);
    res.json({ reply: response });
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

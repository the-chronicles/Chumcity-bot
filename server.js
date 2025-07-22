// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const runBot = require('./post-tmz'); // adjust this if your logic is in a different file

app.get('/', (req, res) => {
  res.send('TMZ bot is online');
});

app.get('/run', async (req, res) => {
  try {
    console.log('🔁 /run triggered!');
    await runBot(); // make sure post-tmz.js exports a function
    res.send('✅ Bot ran successfully!');
  } catch (err) {
    console.error('❌ Bot failed:', err);
    res.status(500).send('❌ Error running bot.');
  }
});

app.listen(port, () => {
  console.log(`Bot web service running at http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, '.')));

// Webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Webhook received!');
  // Add your logic here (e.g., trigger GitHub Actions)
  res.status(200).send('Webhook processed successfully');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// GitHub webhook secret (optional but recommended for security)
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

// Validate GitHub webhook signature (optional but recommended)
function validateWebhook(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return res.status(401).send('Unauthorized: Missing signature');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    return res.status(401).send('Unauthorized: Invalid signature');
  }

  next();
}

// Webhook endpoint
app.post('/webhook', validateWebhook, (req, res) => {
  console.log('Webhook received!');

  // Trigger GitHub Actions workflow
  triggerPipeline()
    .then(() => {
      res.status(200).send('Webhook processed successfully');
    })
    .catch((error) => {
      console.error('Error triggering pipeline:', error);
      res.status(500).send('Failed to trigger pipeline');
    });
});

// GET endpoint for testing
app.get('/webhook', (req, res) => {
  res.status(200).send('Webhook endpoint is live!');
});

// Function to trigger GitHub Actions pipeline
async function triggerPipeline() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'vishwajeet075'; // Replace with your GitHub username
  const REPO_NAME = 'Deployment-Impact-Tracker'; // Replace with your repository name

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

  try {
    const response = await axios.post(
      url,
      {
        event_type: 'trigger-pipeline', // Custom event type
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.everest-preview+json',
        },
      }
    );

    console.log('Pipeline triggered successfully:', response.status);
  } catch (error) {
    console.error('Error triggering pipeline:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
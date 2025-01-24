const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

// Middleware to store raw body for signature validation
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
    console.log('Raw body stored for signature validation');
  }
}));

// GitHub webhook secret (required for security)
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
if (!GITHUB_WEBHOOK_SECRET) {
  console.error('ERROR: GITHUB_WEBHOOK_SECRET environment variable is missing!');
  process.exit(1);
}

// Validate GitHub webhook signature
function validateWebhook(req, res, next) {
  console.log('Validating webhook signature...');
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.error('Unauthorized: Missing signature');
    return res.status(401).send('Unauthorized: Missing signature');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    console.error('Unauthorized: Invalid signature');
    return res.status(401).send('Unauthorized: Invalid signature');
  }

  console.log('Webhook signature validated successfully');
  next();
}

// Webhook endpoint
app.post('/webhook', validateWebhook, (req, res) => {
  console.log('Webhook received! Starting pipeline...');
  
  triggerPipeline()
    .then(() => {
      console.log('Pipeline triggered successfully');
      res.status(200).send('Webhook processed successfully');
    })
    .catch((error) => {
      console.error('Error triggering pipeline:', error);
      res.status(500).send('Failed to trigger pipeline');
    });
});

// GET endpoint for testing
app.get('/webhook', (req, res) => {
  console.log('Webhook endpoint is live!');
  res.status(200).send('Webhook endpoint is live!');
});

// Function to trigger GitHub Actions pipeline
async function triggerPipeline() {
  console.log('Triggering GitHub Actions pipeline...');
  
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'vishwajeet075'; // Replace with your GitHub username
  const REPO_NAME = 'Deployment-Impact-Tracker'; // Replace with your repository name

  if (!GITHUB_TOKEN) {
    console.error('ERROR: GITHUB_TOKEN environment variable is missing!');
    throw new Error('GITHUB_TOKEN is required');
  }

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
    return response.data;
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
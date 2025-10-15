import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// Replace with your actual n8n webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://automations.manymangoes.com.au/webhook/6b51b51f-4928-48fd-b5fd-b39c34f523d1/chat';

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, domain } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Log the request for debugging
    console.log(`📨 Sending to n8n - Domain: ${domain}, Session: ${sessionId}, Message: "${message.substring(0, 50)}..."`);

    // Forward the message, sessionId, and domain to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        sessionId,
        domain
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Received from n8n - Domain: ${domain}, Session: ${sessionId}`);
    
    // Return the n8n response to the frontend
    res.json(data);
  } catch (error) {
    console.error('Error proxying to n8n:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      message: error.message 
    });
  }
});

// Catch-all route: serve index.html for any non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`📡 Proxying chat requests to: ${N8N_WEBHOOK_URL}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist')}`);
});


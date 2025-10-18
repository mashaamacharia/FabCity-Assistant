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
app.use(express.static(path.join(__dirname, '../dist-embed')));

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
      body: JSON.stringify({ message, sessionId, domain }),
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

// Root route - provide instructions for using the widget
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FabCity Assistant Widget Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 { color: #2c3e50; }
        .status { 
          display: inline-block;
          background: #2ecc71; 
          color: white; 
          padding: 5px 10px; 
          border-radius: 4px;
          font-size: 14px;
          margin-left: 10px;
        }
        pre {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          border-left: 4px solid #3498db;
        }
        code {
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        .info {
          background: #e8f4f8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>🤖 FabCity Assistant Widget <span class="status">● Online</span></h1>
      
      <div class="info">
        <strong>Server Status:</strong> Running<br>
        <strong>API Endpoint:</strong> /api/chat<br>
        <strong>Widget Files:</strong> Available
      </div>

      <h2>📦 Installation</h2>
      <p>To embed the chat widget on your website, add this code to your HTML:</p>
      <pre><code>&lt;script src="https://fabcity-assistant.onrender.com/widget.js"&gt;&lt;/script&gt;</code></pre>

      <h2>🔧 Usage</h2>
      <p>The widget will automatically appear on your page once the script is loaded. Make sure to:</p>
      <ul>
        <li>Place the script tag before the closing &lt;/body&gt; tag</li>
        <li>Ensure your domain is properly configured</li>
        <li>Check browser console for any errors</li>
      </ul>

      <h2>📚 API Endpoint</h2>
      <p>POST requests to <code>/api/chat</code> with the following JSON body:</p>
      <pre><code>{
  "message": "Your message here",
  "sessionId": "unique-session-id",
  "domain": "yourdomain.com"
}</code></pre>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`📡 Proxying chat requests to: ${N8N_WEBHOOK_URL}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist-embed')}`);
});
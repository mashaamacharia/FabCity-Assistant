# 🚀 Widget Deployment Guide - Complete Setup

This guide will help you deploy the embeddable widget so clients can add it to their websites.

## 📋 Overview

**What you're deploying:**
- The embeddable widget files (`fabcity-widget.js` and `fabcity-widget.css`)
- These files need to be hosted on a CDN or static hosting
- Clients will add a simple script tag to their websites

**Architecture:**
```
Client Website → Widget JS/CSS → Your Render API → n8n Webhook
```

## 🎯 Step 1: Update API URL

Your main app is now deployed on Render. You need to update the widget to use this URL.

**Find your Render URL** (something like `https://your-app-name.onrender.com`)

### Option A: Set at Build Time (Recommended for Single Deployment)

Update `src/embed.jsx` line 14:

```javascript
// Change from:
apiUrl: window.FabCityConfig?.apiUrl || 'http://localhost:3001',

// To (use your actual Render URL):
apiUrl: window.FabCityConfig?.apiUrl || 'https://your-app-name.onrender.com',
```

**Pros**: Widget works immediately without configuration
**Cons**: Need to rebuild if API URL changes

### Option B: Client-Side Configuration (Flexible)

Keep the default but require clients to set the API URL:

```javascript
// Keep as is:
apiUrl: window.FabCityConfig?.apiUrl || 'http://localhost:3001',
```

**Pros**: Flexible, can change API URL without rebuilding
**Cons**: Clients must include configuration in their embed code

## 🛠️ Step 2: Build the Widget

After updating the API URL, build the widget:

```bash
npm run build:embed
```

This creates the `dist-embed/` folder with:
- `fabcity-widget.js` - The widget JavaScript
- `fabcity-widget.css` - The widget styles

## 🌐 Step 3: Host the Widget Files

You have several options for hosting. Choose one:

---

### **Option 1: Render Static Site** (Easiest - Same Platform)

1. **In your project, create a `static/` folder for widget files:**
   ```bash
   mkdir static
   cp -r dist-embed/* static/
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add static widget files"
   git push
   ```

3. **Create a new Static Site on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - **Publish Directory**: `dist-embed`
   - **Build Command**: `npm install && npm run build:embed`
   - Click "Create Static Site"

4. **Get your widget URL:**
   - After deployment: `https://your-widget.onrender.com/fabcity-widget.js`

---

### **Option 2: Netlify** (Popular, Free CDN)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   # First build
   npm run build:embed
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy --dir=dist-embed --prod
   ```

3. **Get your widget URL:**
   - Netlify will give you: `https://your-site.netlify.app/fabcity-widget.js`

**Alternative - Drag & Drop:**
- Go to [app.netlify.com/drop](https://app.netlify.com/drop)
- Drag your `dist-embed` folder
- Get instant URL

---

### **Option 3: Vercel** (Fast, Global CDN)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build:embed",
     "outputDirectory": "dist-embed",
     "routes": [
       {
         "src": "/(.*)",
         "headers": {
           "Access-Control-Allow-Origin": "*",
           "Cache-Control": "public, max-age=31536000, immutable"
         },
         "dest": "/$1"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Get your widget URL:**
   - Vercel gives you: `https://your-widget.vercel.app/fabcity-widget.js`

---

### **Option 4: GitHub Pages** (Free, Simple)

1. **Create a `gh-pages` branch:**
   ```bash
   git checkout -b gh-pages
   ```

2. **Copy widget files to root:**
   ```bash
   npm run build:embed
   cp -r dist-embed/* .
   git add fabcity-widget.js fabcity-widget.css
   git commit -m "Deploy widget"
   git push origin gh-pages
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

4. **Get your widget URL:**
   - `https://yourusername.github.io/yourrepo/fabcity-widget.js`

---

## 📝 Step 4: Create Client Embed Code

After hosting, create a snippet for your clients. Replace `YOUR-WIDGET-CDN-URL` with your actual URL:

### Basic Embed Code (Option A - API URL Built-in)

```html
<!-- Add this before closing </body> tag -->

<!-- Widget CSS -->
<link rel="stylesheet" href="YOUR-WIDGET-CDN-URL/fabcity-widget.css">

<!-- Widget JavaScript -->
<script src="YOUR-WIDGET-CDN-URL/fabcity-widget.js"></script>
```

### With Configuration (Option B - Client Sets API URL)

```html
<!-- Add this before closing </body> tag -->

<!-- Widget Configuration -->
<script>
  window.FabCityConfig = {
    apiUrl: 'https://your-app-name.onrender.com'
  };
</script>

<!-- Widget CSS -->
<link rel="stylesheet" href="YOUR-WIDGET-CDN-URL/fabcity-widget.css">

<!-- Widget JavaScript -->
<script src="YOUR-WIDGET-CDN-URL/fabcity-widget.js"></script>
```

### Example with Real URLs

```html
<!-- Example with Netlify hosting -->
<script>
  window.FabCityConfig = {
    apiUrl: 'https://fabcity-api.onrender.com'
  };
</script>
<link rel="stylesheet" href="https://fabcity-widget.netlify.app/fabcity-widget.css">
<script src="https://fabcity-widget.netlify.app/fabcity-widget.js"></script>
```

## 🎨 Step 5: Create a Client Integration Page

Create a simple page for clients with copy-paste instructions:

**Create `client-snippet.html`:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Fab City Widget - Integration Code</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { color: #333; margin-top: 0; }
    pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid #dee2e6;
    }
    code { 
      font-family: 'Courier New', monospace;
      color: #e83e8c;
    }
    .copy-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    .copy-btn:hover { background: #0056b3; }
    .note {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🏙️ Fab City AI Chat Widget</h1>
    <p>Add AI-powered chat to your website in 2 minutes!</p>
    
    <h2>📋 Installation Instructions</h2>
    <p>Copy and paste this code snippet <strong>before the closing &lt;/body&gt; tag</strong> in your HTML:</p>
    
    <pre id="embed-code"><code>&lt;!-- Fab City AI Chat Widget --&gt;
&lt;link rel="stylesheet" href="YOUR-WIDGET-CDN-URL/fabcity-widget.css"&gt;
&lt;script src="YOUR-WIDGET-CDN-URL/fabcity-widget.js"&gt;&lt;/script&gt;</code></pre>
    
    <button class="copy-btn" onclick="copyCode()">📋 Copy Code</button>
    
    <div class="note">
      <strong>✨ That's it!</strong> The chat widget will appear in the bottom-right corner of your website.
    </div>
    
    <h2>🎯 Features</h2>
    <ul>
      <li>✅ AI-powered responses</li>
      <li>✅ Automatic domain detection</li>
      <li>✅ Session management</li>
      <li>✅ Mobile responsive</li>
      <li>✅ No dependencies required</li>
    </ul>
    
    <h2>🛠️ Support</h2>
    <p>Need help? Contact us or check the documentation.</p>
  </div>
  
  <script>
    function copyCode() {
      const code = document.getElementById('embed-code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('✅ Code copied to clipboard!');
      });
    }
  </script>
</body>
</html>
```

## ✅ Testing Checklist

Before giving to clients:

1. **Test Locally:**
   ```bash
   npm run build:embed
   # Open embed-example.html in browser
   ```

2. **Test on Hosting:**
   - Visit your hosted widget URL
   - Verify both `.js` and `.css` files are accessible
   - Check CORS headers are set correctly

3. **Test on Sample Site:**
   - Create a simple HTML page
   - Add your embed code
   - Verify widget loads
   - Test sending messages
   - Check browser console for errors

4. **Test Domain Detection:**
   - Verify domain is captured correctly
   - Check server logs to confirm domain is received

## 🔒 Security & Performance

### CORS Configuration

Your widget files need proper CORS headers. Add to your static hosting:

**For Render Static Site** - Create `render.yaml`:
```yaml
services:
  - type: web
    name: fabcity-widget
    env: static
    buildCommand: npm run build:embed
    staticPublishPath: ./dist-embed
    headers:
      - path: /*
        name: Access-Control-Allow-Origin
        value: '*'
      - path: /*
        name: Cache-Control
        value: 'public, max-age=31536000, immutable'
```

**For Netlify** - Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Cache-Control = "public, max-age=31536000, immutable"
```

**For Vercel** - Already included in `vercel.json` above

## 📊 Monitoring

Track widget usage:

1. **Server Logs** - Check your Render API logs for incoming requests
2. **n8n Executions** - Monitor n8n workflow executions
3. **Browser Console** - The widget logs domain and session info

## 🔄 Updating the Widget

When you need to update the widget:

1. Make changes to your code
2. Run `npm run build:embed`
3. Deploy updated files to your hosting
4. Files are cached, so changes may take time to propagate
5. Consider versioning: `fabcity-widget-v2.js`

## 🎉 You're Done!

Your widget deployment is complete! Your clients can now add the widget to their sites with a simple script tag.

### Quick Reference

- **Main App (Render):** `https://your-app.onrender.com`
- **Widget Files:** Hosted on [your chosen platform]
- **Client Embed Code:** [Copy from Step 4]

---

**Need help?** Check your Render logs and browser console for debugging.


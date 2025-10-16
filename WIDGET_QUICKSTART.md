# 🚀 Widget Deployment - Quick Start

Follow these simple steps to deploy your widget for clients.

## ✅ Step-by-Step Checklist

### 1️⃣ Update API URL (2 minutes)

1. Open `widget.config.js`
2. Replace `YOUR-RENDER-APP-NAME` with your actual Render app name
   ```javascript
   // Find your Render URL from your dashboard
   // It looks like: https://fabcity-chat-abc123.onrender.com
   
   apiUrl: 'https://YOUR-ACTUAL-RENDER-URL.onrender.com',
   ```
3. Save the file

**Example:**
```javascript
// If your Render URL is: https://fabcity-chat-widget.onrender.com
apiUrl: 'https://fabcity-chat-widget.onrender.com',
```

### 2️⃣ Build the Widget (1 minute)

Run this command:

```bash
npm run build:embed
```

✅ This creates the `dist-embed/` folder with:
- `fabcity-widget.js` (your widget code)
- `fabcity-widget.css` (widget styles)

### 3️⃣ Choose Hosting & Deploy (5-10 minutes)

Pick ONE option (I recommend Netlify for simplicity):

#### **Option A: Netlify (Easiest)** 🌟

```bash
# Install CLI (one-time)
npm install -g netlify-cli

# Login (one-time)
netlify login

# Deploy
netlify deploy --dir=dist-embed --prod
```

Copy your URL: `https://your-site-name.netlify.app`

#### **Option B: Render Static Site**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm run build:embed`
   - **Publish Directory**: `dist-embed`
5. Click "Create"

Copy your URL: `https://your-widget.onrender.com`

#### **Option C: Drag & Drop (No CLI)**

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your `dist-embed` folder
3. Done! Copy the URL

### 4️⃣ Create Client Snippet (2 minutes)

Replace `YOUR-WIDGET-URL` with the URL from step 3:

```html
<!-- Add this before </body> tag -->
<link rel="stylesheet" href="YOUR-WIDGET-URL/fabcity-widget.css">
<script src="YOUR-WIDGET-URL/fabcity-widget.js"></script>
```

**Real Example:**
```html
<!-- With Netlify -->
<link rel="stylesheet" href="https://fabcity-widget.netlify.app/fabcity-widget.css">
<script src="https://fabcity-widget.netlify.app/fabcity-widget.js"></script>
```

### 5️⃣ Test It! (2 minutes)

1. Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Testing Fab City Widget</h1>
  <p>The chat widget should appear in the bottom-right corner.</p>
  
  <!-- Your widget code here -->
  <link rel="stylesheet" href="YOUR-WIDGET-URL/fabcity-widget.css">
  <script src="YOUR-WIDGET-URL/fabcity-widget.js"></script>
</body>
</html>
```

2. Open in browser
3. Click the chat button
4. Send a test message
5. ✅ Success!

## 📋 What to Give Clients

Send them this simple snippet:

```
Hi! To add the Fab City AI Chat to your website:

1. Open your website's HTML file
2. Find the closing </body> tag
3. Paste this code RIGHT BEFORE it:

<link rel="stylesheet" href="[YOUR-WIDGET-URL]/fabcity-widget.css">
<script src="[YOUR-WIDGET-URL]/fabcity-widget.js"></script>

4. Save and publish your site
5. The chat widget will appear in the bottom-right corner!

That's it! 🎉
```

## 🔄 Common URLs You'll Need

Keep these handy:

- **Main API (Render)**: `https://[your-app].onrender.com`
- **Widget JS**: `https://[your-widget-host]/fabcity-widget.js`
- **Widget CSS**: `https://[your-widget-host]/fabcity-widget.css`
- **n8n Webhook**: (already configured in your server)

## 🐛 Quick Troubleshooting

**Widget not showing?**
- Check browser console (F12)
- Verify URLs are correct and accessible
- Make sure code is before `</body>` tag

**Chat not working?**
- Check that `widget.config.js` has correct API URL
- Verify your Render API is running
- Check Render logs for errors

**Different API URL for different clients?**
Clients can override with:
```html
<script>
  window.FabCityConfig = {
    apiUrl: 'https://custom-api.com'
  };
</script>
<link rel="stylesheet" href="...">
<script src="..."></script>
```

## 🎯 You're All Set!

Your widget is now deployed and ready for clients! 🎉

**Next Steps:**
1. Test on a few sample websites
2. Share the embed code with clients
3. Monitor your Render API logs
4. Check n8n executions

---

**Pro Tip:** Save the embed code snippet in a text file for easy sharing with clients!


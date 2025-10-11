# 🔌 Integration Guide - Fab City AI Chat Widget

## Overview

The Fab City AI Chat Widget is designed as a **standalone component** that can be easily integrated into any page of your website. It features a full-page ChatGPT-like interface that's centrally placed and fully responsive.

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

Create a `.env` file:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/fabcity-chat
```

---

## 🎯 Integration Options

### Option 1: Import as React Component (Recommended)

Simply import the ChatWidget component into any React page:

```jsx
import ChatWidget from './components/ChatWidget';

function YourPage() {
  return (
    <div>
      {/* Your page content */}
      <h1>Welcome to Fab City</h1>
      <p>Your content here...</p>
      
      {/* Add the chat widget */}
      <ChatWidget />
    </div>
  );
}

export default YourPage;
```

### Option 2: Build as Standalone Widget

Build the widget and embed it anywhere:

```bash
npm run build
```

Then include the built files in any HTML page:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/dist/assets/index.css">
</head>
<body>
  <div id="fabcity-chat"></div>
  <script type="module" src="/dist/assets/index.js"></script>
</body>
</html>
```

### Option 3: Use as Web Component (Future Enhancement)

We can package this as a Web Component for non-React sites:

```html
<fabcity-chat-widget api-url="your-api-url"></fabcity-chat-widget>
```

---

## 🎨 How It Works

### Floating Button (Closed State)
- Fixed position: bottom-right corner
- Animated pulsing ring effect
- Click to open full-page chat

### Full-Page Chat (Open State)
- Takes over entire viewport
- Centered content (max-width: 1024px)
- Professional header with Fab City branding
- Welcome screen with suggested questions
- Input area fixed at bottom center
- Fully responsive design

---

## 🔧 Customization

### 1. Change Suggestion Prompts

Edit `src/components/ChatWidget.jsx`:

```jsx
const SUGGESTIONS = [
  "Your custom question 1",
  "Your custom question 2",
  "Your custom question 3",
  "Your custom question 4"
];
```

### 2. Customize Header

Edit the header section in `ChatWidget.jsx`:

```jsx
<h1 className="text-xl font-semibold text-gray-900">
  Your Custom Title
</h1>
<p className="text-sm text-gray-500">
  Your custom subtitle
</p>
```

### 3. Modify Welcome Message

Change the welcome content:

```jsx
<h2 className="text-3xl font-bold text-gray-900 mb-3">
  Your Welcome Title
</h2>
<p className="text-lg text-gray-600 mb-8">
  Your welcome description
</p>
```

### 4. Update Colors

All colors are in `tailwind.config.js`:

```js
colors: {
  'fabcity-green': '#3EB489',
  'fabcity-yellow': '#FFA62B',
  'fabcity-blue': '#1C5D99',
}
```

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- Full-page overlay when open
- Content centered with max-width of 1024px
- Input area spans full width (centered)
- 2-column suggestion grid

### Mobile (<768px)
- Full-screen experience
- Single-column suggestion grid
- Touch-optimized buttons
- Auto-focus on input

---

## 🔌 Backend Integration

### API Endpoint: `/api/chat`

**Request:**
```json
POST /api/chat
{
  "message": "User's question"
}
```

**Response (from n8n):**
```json
{
  "response": "AI's answer"
}
```

Or alternatively:
```json
{
  "message": "AI's answer"
}
```

### Running the Backend

The Express server proxies requests to your n8n webhook:

```bash
npm run server
```

Server runs on: `http://localhost:3001`

---

## 🚀 Deployment

### Frontend Deployment

Build the app:
```bash
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Your web server

### Backend Deployment

Deploy `server/index.js` to:
- Heroku
- Railway
- Vercel Serverless
- AWS Lambda
- Your Node.js server

### Environment Variables

Set in production:
```
N8N_WEBHOOK_URL=https://your-production-n8n-instance/webhook/fabcity-chat
```

---

## 🎯 Features Included

✅ **Full-page centered chat** (ChatGPT-style)  
✅ **Floating bubble button** with pulse animation  
✅ **Professional header** with Fab City branding  
✅ **Suggestion prompts** for new users  
✅ **Markdown support** in messages  
✅ **Rich media previews** (PDF, images, videos, web)  
✅ **Loading indicators** with brand colors  
✅ **Auto-scroll** to latest messages  
✅ **Responsive design** (mobile to desktop)  
✅ **Error handling** with user-friendly messages  

---

## 🧪 Testing Without n8n

For testing the UI without n8n, modify `server/index.js`:

```javascript
// Around line 20, replace the n8n fetch with:
const data = {
  response: "This is a test response from Fab City AI! You can use **markdown** and [links](https://fabcity.org)."
};
res.json(data);
```

---

## 📋 Integration Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Configure `.env` with n8n webhook URL
- [ ] Test locally (`npm run server` + `npm run dev`)
- [ ] Customize suggestions and branding
- [ ] Update colors if needed
- [ ] Build for production (`npm run build`)
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Test on production
- [ ] Monitor analytics and errors

---

## 🛠️ Troubleshooting

### Widget Not Appearing
- Check that `ChatWidget` is imported correctly
- Ensure CSS is loaded (Tailwind)
- Check browser console for errors

### Chat Not Sending Messages
- Verify backend is running (`npm run server`)
- Check `.env` has correct n8n URL
- Check browser network tab for API errors

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with your site
- Verify all dependencies are installed

---

## 📞 Support

Need help integrating the widget? Check the documentation:
- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Setup guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start

---

**Ready to integrate! 🚀**

The widget is designed to work seamlessly with any Fab City website or React application.


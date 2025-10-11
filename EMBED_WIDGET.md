# 🎯 Fab City Widget - Quick Embed Guide

## For Website Owners - 3 Steps to Add AI Chat

### Step 1: Add Configuration (Optional but Recommended)

Add this just before `</body>` in your HTML:

```html
<script>
  window.FabCityConfig = {
    apiUrl: 'https://api.fabcity.com'  // Your API server URL
  };
</script>
```

### Step 2: Add Widget Stylesheet

```html
<link rel="stylesheet" href="https://cdn.fabcity.com/widget/fabcity-widget.css">
```

### Step 3: Add Widget Script

```html
<script src="https://cdn.fabcity.com/widget/fabcity-widget.js"></script>
```

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <!-- Your existing head content -->
</head>
<body>
  <!-- Your website content -->
  
  <!-- Fab City AI Widget - Add before closing </body> tag -->
  <script>
    window.FabCityConfig = {
      apiUrl: 'https://api.fabcity.com'
    };
  </script>
  <link rel="stylesheet" href="https://cdn.fabcity.com/widget/fabcity-widget.css">
  <script src="https://cdn.fabcity.com/widget/fabcity-widget.js"></script>
</body>
</html>
```

## ✨ What You Get

- 💬 AI-powered chat widget in bottom-right corner
- 🔄 Automatic conversation memory (sessions persist)
- 🌐 Domain-aware routing (different AI for different sites)
- 📱 Mobile responsive
- 🎨 Beautiful, modern UI

## 🎨 For Different Platforms

### WordPress
1. Go to Appearance → Theme Editor
2. Open `footer.php`
3. Add the code before `</body>`
4. Save

### Wix
1. Go to Settings → Custom Code
2. Add code to "Body - End"
3. Save

### Shopify
1. Go to Online Store → Themes → Actions → Edit Code
2. Open `theme.liquid`
3. Add code before `</body>`
4. Save

### Webflow
1. Go to Project Settings → Custom Code
2. Add to "Footer Code"
3. Publish

## 🔧 For Developers

### React / Next.js

```jsx
// app/layout.js or _app.js
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Configure
    window.FabCityConfig = {
      apiUrl: process.env.NEXT_PUBLIC_FABCITY_API_URL
    };

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.fabcity.com/widget/fabcity-widget.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdn.fabcity.com/widget/fabcity-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (link.parentNode) link.remove();
      if (script.parentNode) script.remove();
    };
  }, []);

  return <html><body>{children}</body></html>;
}
```

### Vue / Nuxt

```vue
<!-- app.vue or layout/default.vue -->
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Configure
  window.FabCityConfig = {
    apiUrl: import.meta.env.VITE_FABCITY_API_URL
  };

  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.fabcity.com/widget/fabcity-widget.css';
  document.head.appendChild(link);

  // Load JS
  const script = document.createElement('script');
  script.src = 'https://cdn.fabcity.com/widget/fabcity-widget.js';
  script.async = true;
  document.body.appendChild(script);
});
</script>
```

### Angular

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Configure
    (window as any).FabCityConfig = {
      apiUrl: environment.fabcityApiUrl
    };

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.fabcity.com/widget/fabcity-widget.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdn.fabcity.com/widget/fabcity-widget.js';
    script.async = true;
    document.body.appendChild(script);
  }
}
```

## 🧪 Testing

After adding the code:

1. **Refresh your website**
2. **Look for the chat button** in the bottom-right corner
3. **Click it** to open the chat
4. **Send a test message**
5. **Check browser console** (F12) to see:
   ```
   🌐 Widget initialized on domain: your-domain.com
   🔑 Session ID: session_xxx
   ```

## ❓ FAQ

### Where will the chat button appear?
Bottom-right corner of every page where you add the code.

### Will it slow down my website?
No, the script loads asynchronously and doesn't block page rendering.

### Can I customize the position or colors?
Contact the Fab City team for customization options.

### Does it work on mobile?
Yes! The widget is fully responsive and works on all devices.

### How is my data used?
All conversations are routed through your configured AI agents in n8n.

### Can I remove it later?
Yes, just delete the 3 lines of code you added.

## 🆘 Need Help?

- The chat button doesn't appear → Check browser console (F12) for errors
- Messages not sending → Verify API URL in configuration
- Wrong AI responding → Check domain in n8n routing

For detailed technical documentation, see `CLIENT_INTEGRATION_GUIDE.md`

---

**That's it!** 🎉 Your website now has an intelligent AI chat assistant.


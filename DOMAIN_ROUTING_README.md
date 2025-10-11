# 🌐 Domain-Based Routing Implementation

## What Was Built

Your Fab City AI Chat Widget now:

1. ✅ **Captures the domain** where it's embedded
2. ✅ **Sends domain to n8n** along with message and sessionId
3. ✅ **Embeddable on any website** with 3 lines of code
4. ✅ **Routes to different AI agents** based on domain

## Data Flow

```
User on learn.fabcity.com asks: "What is Fab City?"
    ↓
Widget captures:
    • message: "What is Fab City?"
    • sessionId: "session_1728483920123_k2j9d8f7a"
    • domain: "learn.fabcity.com"
    ↓
Sends to your API server
    ↓
API forwards to n8n webhook
    ↓
n8n IF node checks domain:
    • Contains "learn.fabcity" → Learn AI Agent
    • Contains "network.fabcity" → Network AI Agent
    • Other → Default AI Agent
    ↓
AI responds with context from correct knowledge base
    ↓
Response shows in chat widget
```

## Files Modified

### Frontend
- `src/components/ChatWidget.jsx`
  - Added domain capture: `window.location.hostname`
  - Added configurable API URL for embedding
  - Sends message + sessionId + domain

### Backend
- `server/index.js`
  - Receives domain from frontend
  - Validates domain is present
  - Forwards to n8n with all three fields
  - Added logging for domain tracking

### New Files Created

#### Widget Embedding
- `src/embed.jsx` - Standalone widget entry point
- `vite.embed.config.js` - Build config for embeddable version
- `embed-example.html` - Live demo/test page

#### Documentation
- `CLIENT_INTEGRATION_GUIDE.md` - Complete integration guide for clients
- `EMBED_WIDGET.md` - Simple 3-step embed instructions
- `DEPLOYMENT_GUIDE.md` - Full production deployment guide
- `DOMAIN_ROUTING_README.md` - This file
- Updated `SESSION_ID_FIX_GUIDE.md` - Added domain info

#### Configuration
- Updated `package.json` - Added build:embed scripts

## How Clients Embed the Widget

Just 3 lines of code in their HTML:

```html
<script>
  window.FabCityConfig = { apiUrl: 'https://api.fabcity.com' };
</script>
<link rel="stylesheet" href="https://cdn.fabcity.com/widget/fabcity-widget.css">
<script src="https://cdn.fabcity.com/widget/fabcity-widget.js"></script>
```

## n8n Configuration

### Webhook Receives

```json
{
  "message": "User's question",
  "sessionId": "session_1728483920123_k2j9d8f7a",
  "domain": "learn.fabcity.com"
}
```

### IF Node Setup

**Condition 1:**
- Value 1: `{{ $json.domain }}`
- Operation: `Contains`
- Value 2: `learn.fabcity`
- True → Connect to Learn AI Agent

**Condition 2:**
- Value 1: `{{ $json.domain }}`
- Operation: `Contains`
- Value 2: `network.fabcity`
- True → Connect to Network AI Agent

**ELSE:**
- Default AI Agent

### AI Agent Configuration

For each agent:
- **Session ID:** `{{ $json.sessionId }}`
- **User Message:** `{{ $json.message }}`
- **Knowledge Base:** Domain-specific content

## Testing Locally

1. **Build the widget:**
   ```bash
   npm run build:embed
   ```

2. **Start the API server:**
   ```bash
   npm run server
   ```

3. **Open test page:**
   ```bash
   open embed-example.html
   ```

4. **Check browser console for:**
   ```
   🌐 Widget initialized on domain: localhost
   🔑 Session ID: session_xxx
   ```

5. **Check server logs for:**
   ```
   📨 Sending to n8n - Domain: localhost, Session: session_xxx
   ✅ Received from n8n - Domain: localhost, Session: session_xxx
   ```

## Production Deployment

### 1. Build
```bash
npm run build:embed
```

### 2. Upload to CDN
Upload these files:
- `dist-embed/fabcity-widget.js`
- `dist-embed/fabcity-widget.css`

### 3. Deploy API Server
Deploy `server/index.js` to your hosting platform

### 4. Configure n8n
Set up IF node routing as described above

### 5. Share Embed Code
Give clients the 3-line embed code with your production URLs

## Use Cases

### Example 1: Different Knowledge Bases

- **learn.fabcity.com** → Educational content, tutorials, concepts
- **network.fabcity.com** → Community info, events, collaboration

### Example 2: Multi-Language

- **en.fabcity.com** → English AI agent
- **es.fabcity.com** → Spanish AI agent
- **fr.fabcity.com** → French AI agent

### Example 3: Client-Specific

- **client1.com** → Client 1's custom agent
- **client2.com** → Client 2's custom agent
- Others → Generic agent

### Example 4: Feature Gating

- **premium.fabcity.com** → Advanced AI with more features
- **basic.fabcity.com** → Standard AI with basic features

## Benefits

✅ **One widget, multiple uses** - Same code works for all clients
✅ **Automatic routing** - No manual configuration per site
✅ **Isolated conversations** - Each domain gets appropriate context
✅ **Easy to embed** - Just 3 lines of code
✅ **Session persistence** - Conversations maintain context
✅ **Domain awareness** - AI knows which site user is on

## Next Steps

1. **Build and test locally**
   ```bash
   npm run build:embed
   npm run server
   ```

2. **Test with n8n** - Set up IF node routing

3. **Deploy to production** - Follow DEPLOYMENT_GUIDE.md

4. **Share with clients** - Provide EMBED_WIDGET.md

5. **Monitor** - Watch server and n8n logs

## Quick Reference

| Documentation | Purpose |
|---------------|---------|
| `EMBED_WIDGET.md` | Simple client instructions |
| `CLIENT_INTEGRATION_GUIDE.md` | Detailed technical guide |
| `DEPLOYMENT_GUIDE.md` | Full production deployment |
| `SESSION_ID_FIX_GUIDE.md` | Implementation details |
| `embed-example.html` | Working demo |

## Questions?

- Widget doesn't appear? → Check CDN URLs
- Wrong AI responds? → Check n8n IF conditions
- No conversation memory? → Verify sessionId in AI node
- CORS errors? → Add domain to allowedOrigins

---

**Status:** ✅ Implementation complete and ready for deployment!


# Quick Start Guide - Pokemon Team Creator

## 30-Second Setup

### 1. Get Your OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy it (you'll need it in step 3)

### 2. Backend Setup (Terminal 1)
```bash
cd pokemon-team-creator/server
npm install
```

### 3. Create .env File
In the `server` folder, create a file named `.env` with:
```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
NODE_ENV=development
```

### 4. Start Backend (Terminal 1)
```bash
npm start
```
You should see: `Pokemon Team Creator server running on port 5000`

### 5. Frontend Setup (Terminal 2)
```bash
cd pokemon-team-creator/client
npm install
npm start
```
The app will open at `http://localhost:3000`

## Using the App

1. **Click Pokemon Cards** - Select 0-6 Pokemon from the left panel
   - Click card to add/remove
   - Search by name
   - See Pokemon image and types

2. **Write Your Strategy** - In the text area, describe what you want:
   - "Make my team bulkier"
   - "Optimize for speed"
   - "Counter dragon types"
   - "Competitive balanced team"

3. **Click "Generate Team"** - Wait for AI recommendations

4. **Review Results** - See:
   - Suggested Pokemon to add
   - Movesets for each Pokemon
   - Recommended held items
   - Team strategy explanation

## File Structure
```
pokemon-team-creator/
├── server/           ← Backend (Node.js + LLM)
├── client/           ← Frontend (React)
├── README.md         ← Project overview
├── SETUP.md          ← Detailed setup
└── AI_AGENT_ARCHITECTURE.md  ← Technical details
```

## What Each Part Does

**Backend (server/):**
- Connects to OpenAI API
- Parses LLM responses
- Executes team recommendations
- Validates inputs
- Logs all actions

**Frontend (client/):**
- Pokemon picker with images
- Strategy input form
- Displays AI recommendations
- Beautiful UI with gradients

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "OPENAI_API_KEY" error | Add OPENAI_API_KEY to .env file |
| Port 5000 in use | Change PORT in .env, update proxy in client/package.json |
| Can't find Pokemon | Make sure search term is correct (case-insensitive) |
| Rate limit error | Wait 15 minutes before next request (60 requests/15 min) |
| Frontend won't connect | Make sure backend is running on port 5000 |

## Example Walkthrough

### Step 1: Select Pokemon
- Click "Pikachu" card
- Click "Charizard" card  
- Click "Blastoise" card
- See "Selected: 3/6" at top

### Step 2: Enter Strategy
```
In the text area, type:
"Make my team faster and add more special attackers"
```

### Step 3: Generate
- Click "Generate Team" button
- Wait 2-5 seconds for AI to respond

### Step 4: Review Recommendations
App will show:
- "Alakazam, Gengar" as suggested additions
- Movesets for each Pokemon
- Items like "Life Orb", "Choice Scarf"
- Explanation of team strategy
- Tips for using the team

## API Endpoints (for testing)

```bash
# Get all Pokemon
curl http://localhost:5000/api/pokemon

# Search Pokemon
curl http://localhost:5000/api/pokemon/search/pika

# Get Pokemon by ID
curl http://localhost:5000/api/pokemon/25

# Health check
curl http://localhost:5000/api/health

# Generate team
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{
    "team": ["Pikachu"],
    "strategy": "make my team bulkier"
  }'
```

## Key Features

✅ **AI-Powered** - Uses OpenAI GPT-4o-mini for recommendations
✅ **Safe** - Input validation, rate limiting, error handling
✅ **Fast** - Responsive UI, caching
✅ **Logged** - All actions tracked for debugging
✅ **Beautiful** - Modern gradient UI, Pokemon images
✅ **Flexible** - 0-6 Pokemon, any strategy request

## Files to Know

| File | Purpose |
|------|---------|
| `server/llm/llmClient.js` | Connects to OpenAI API |
| `server/actions/actionExecutor.js` | Parses LLM responses |
| `server/routes/team.js` | Team API endpoints |
| `client/src/App.js` | Main React component |
| `client/src/components/PokemonPicker.js` | Pokemon selection UI |
| `client/src/components/Recommendations.js` | Display results |

## Next Steps

1. **Get it running** - Follow Quick Start above (5 minutes)
2. **Test it** - Try different Pokemon and strategies
3. **Customize** - Edit prompts in `server/llm/llmClient.js`
4. **Deploy** - Use Vercel (frontend) + Heroku (backend)

## Common Customizations

### Change LLM Model
Edit `server/.env`:
```
OPENAI_MODEL=gpt-4  # Slower but better results
```

### Change Rate Limit
Edit `server/llm/llmClient.js`:
```javascript
new RateLimiter(120, 900000) // 120 requests per 15 min
```

### Add More Pokemon
Edit `server/config/pokemonData.js`:
```javascript
{ id: 999, name: 'NewPokemon', types: ['Type'] }
```

## Need Help?

1. Check **SETUP.md** for detailed instructions
2. Check **AI_AGENT_ARCHITECTURE.md** for technical details
3. Check error logs: `server/error.log`
4. Check browser console: Press F12 → Console tab

---

**Ready to build your dream Pokemon team! 🎮⚡**

# Quick Start Guide - Pokemon Team Creator

## 2-Minute Setup

### 1. Prerequisites
- Node.js installed
- OpenAI API key (get from https://platform.openai.com/api-keys)
- Firebase project with Firestore & Auth enabled

### 2. Backend Setup (Terminal 1)
```bash
cd pokemon-team-creator/server
npm install
```

### 3. Create server/.env
```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
NODE_ENV=development
```

### 4. Start Backend
```bash
npm start
# You should see: "Pokemon Team Creator server running on port 5000"
```

### 5. Frontend Setup (Terminal 2)
```bash
cd pokemon-team-creator/client
npm install
```

### 6. Create client/.env
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 7. Start Frontend
```bash
npm start
# Opens http://localhost:3000 automatically
```

## Complete User Workflow

### 1. Create Account
- Click "Create Account" link on login page
- Enter display name, email, password
- Account created in Firebase

### 2. Select Pokemon
- Click Pokemon cards to add (0-6 total)
- Click the ✕ button to remove any Pokemon
- Search by name using the search box

### 3. Enter Strategy
- Type in the "Team Strategy" text area
- Examples: "make it bulkier", "counter water types", "optimize for speed"

### 4. Generate Recommendations
- Click "Generate Team" button
- Watch the loading spinner while AI works
- Can press ESC or click Cancel if needed

### 5. Review Results
Modal shows:
- Suggested Pokemon to add
- Movesets for each with type/purpose info
- Held items with reasoning
- Overall team strategy
- Team composition details

### 6. Save Your Team
- Click "Save This Team" button
- Enter team name (required)
- Add optional description
- Team saves to Firestore

### 7. Manage Teams
- Click "My Teams" in navbar
- View all your saved teams with Pokemon images
- Load teams to edit again
- Rename with ✏️ button
- Delete with 🗑️ button

## File Structure
```
pokemon-team-creator/
├── server/                  ← Node.js + Express backend
│   ├── llm/                ← OpenAI integration
│   ├── actions/            ← Team recommendation logic
│   ├── routes/             ← API endpoints
│   ├── utils/              ← Validation, rate limiting
│   └── .env                ← OpenAI key (in .gitignore)
│
├── client/                  ← React frontend
│   ├── src/
│   │   ├── components/     ← React components
│   │   ├── pages/          ← Auth pages (Login, SignUp)
│   │   ├── services/       ← Firebase & API services
│   │   ├── styles/         ← CSS files
│   │   ├── App.js          ← Main app component
│   │   └── index.js        ← React entry point
│   ├── public/             ← Static files
│   └── .env                ← Firebase config (in .gitignore)
│
├── .gitignore              ← Excludes .env and node_modules
├── README.md               ← Project overview
├── START_HERE.md           ← What you built
└── SETUP.md                ← Detailed setup guide
```

## What Each Part Does

**Backend (server/):**
- Connects to OpenAI API (GPT-4o-mini)
- Parses LLM responses into actionable recommendations
- Validates team compositions
- Rate limits API calls
- Logs all operations

**Frontend (client/):**
- Firebase Authentication (sign up, login, logout)
- Pokemon picker with images and search
- Strategy input form
- Modal popups for recommendations and saving
- Firestore integration for team persistence
- Navigation between Team Builder and My Teams pages
- Beautiful red/gold Pokéball theme

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module 'openai'" | Run `npm install openai` in server folder |
| Port 5000 already in use | Change PORT in server/.env |
| Firebase errors | Check REACT_APP_FIREBASE_* keys in client/.env |
| "Cannot sign up" | Verify Firebase Auth is enabled in console |
| Pokemon images not showing | Check browser console for network errors |
| Rate limit exceeded | Wait 15 minutes (60 requests/15 min) |
| Frontend won't start | Delete node_modules, run `npm install` again |

## Key Features

✅ **Authentication** - Email/password sign up and login  
✅ **Team Saving** - Save teams to Firestore with names  
✅ **Team Loading** - Load previously saved teams to edit  
✅ **Pokemon Deletion** - Remove Pokemon with ✕ buttons  
✅ **Team Management** - Rename and delete saved teams  
✅ **Beautiful UI** - Red/gold Pokéball theme  
✅ **Error Handling** - Friendly error messages and cancellation  
✅ **Request Cancellation** - Press ESC to cancel during loading
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

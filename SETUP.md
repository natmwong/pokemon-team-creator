# Setup Instructions

## Prerequisites

Before getting started, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Firebase Project** - [Create one here](https://console.firebase.google.com/)
- **Git** (optional, for version control)

## Firebase Setup (Required for Authentication & Team Storage)

1. **Create a Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Create a project"
   - Name it "pokemon-team-creator"
   - Accept the defaults and create

2. **Enable Authentication**
   - In Firebase Console, go to **Authentication**
   - Click **Get started**
   - Click **Email/Password** provider
   - Toggle "Enable" and save

3. **Enable Firestore Database**
   - In Firebase Console, go to **Firestore Database**
   - Click **Create database**
   - Start in **test mode** (for development)
   - Choose a location (us-central1 recommended)
   - Click **Enable**

4. **Get Firebase Config**
   - In Firebase Console, click **Project Settings** (⚙️)
   - Scroll down to "Your apps"
   - Click on your web app (or create one)
   - Copy the config object - you'll need these values for `client/.env`

## Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `server` directory:
   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   PORT=5000
   NODE_ENV=development
   ```
   
   Replace `sk-your-key-here` with your actual OpenAI API key from https://platform.openai.com/api-keys

4. **Start the backend server:**
   ```bash
   npm start
   ```

   You should see: `Pokemon Team Creator server running on port 5000`

## Frontend Setup

1. **In a new terminal, navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `client` directory with your Firebase config:
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSyABus8xnd7XQ8w5VzFi2cm72BuR-sGjmM8
   REACT_APP_FIREBASE_AUTH_DOMAIN=pokemon-team-creator-6400f.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=pokemon-team-creator-6400f
   REACT_APP_FIREBASE_STORAGE_BUCKET=pokemon-team-creator-6400f.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=951648292290
   REACT_APP_FIREBASE_APP_ID=1:951648292290:web:2de06ec7cc0225661bda5b
   ```
   
   Replace these values with your actual Firebase config from Project Settings

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Complete User Workflow

1. **Create Account**
   - Enter display name, email, password
   - Click "Create Account"
   - Account is created in Firebase

2. **Select & Customize Pokemon**
   - Click Pokemon cards to add (0-6 total)
   - Use search to find specific Pokemon
   - Click ✕ to remove any Pokemon

3. **Enter Team Strategy**
   - Type in the "Team Strategy" text area
   - Examples: "make it bulkier", "counter water types"

4. **Generate Recommendations**
   - Click "Generate Team"
   - Wait for AI to analyze and recommend

5. **Save Your Team**
   - Click "Save This Team"
   - Enter team name and optional description
   - Team saves to Firestore

6. **Manage Saved Teams**
   - Click "My Teams" to view all saved teams
   - Load, rename, or delete teams
   - Load a team to continue editing

## Architecture

### Backend (Node.js + Express)

- **LLM Integration Module** (`server/llm/llmClient.js`):
  - Connects to OpenAI API
  - Implements rate limiting (60 requests per 15 minutes)
  - Handles errors with exponential backoff retry logic

- **Action Executor Module** (`server/actions/actionExecutor.js`):
  - Parses LLM responses
  - Validates JSON output
  - Executes concrete actions

- **API Routes**:
  - `/api/pokemon` - Get Pokemon list
  - `/api/team/generate` - Generate team recommendations
  - `/api/team/analyze` - Analyze team composition
  - `/api/team/suggest-movesets` - Get movesets
  - `/api/team/suggest-items` - Get item recommendations

- **Utility Modules**:
  - Input validation (`server/utils/validation.js`)
  - Rate limiting (`server/utils/rateLimiter.js`)
  - Logging (`server/utils/logger.js`)

### Frontend (React)

- **Components**:
  - `PokemonPicker` - Select Pokemon for your team
  - `TeamBuilder` - Enter strategy and generate team
  - `Recommendations` - Display AI recommendations

- **API Client** (`client/src/api.js`):
  - HTTP client with error handling
  - Axios interceptors for rate limiting

## Features Implemented

✅ **LLM Integration**: OpenAI API connection with error handling
✅ **Action Interpreter**: Parse and validate LLM responses
✅ **User Interface**: React-based web interface
✅ **Error Handling**: Comprehensive error handling and logging
✅ **Safety Features**: Input validation and rate limiting
✅ **Pokemon Selection**: Interactive picker with images (0-6 Pokemon)
✅ **Team Strategy**: Natural language strategy requests
✅ **AI Recommendations**: Movesets, held items, team composition
✅ **Auditability**: All actions logged with timestamps

## Troubleshooting

### "OPENAI_API_KEY environment variable is required"
- Make sure you've created the `.env` file with your API key
- The key should start with `sk-`

### Port 5000 already in use
- Change `PORT` in `.env` to a different port
- Update the proxy in `client/package.json` to match

### "Rate limit exceeded"
- The API is limited to 60 requests per 15 minutes
- Wait a few minutes before trying again

### Frontend won't connect to backend
- Make sure the backend is running on `http://localhost:5000`
- Check that the proxy setting in `client/package.json` is correct

## Development

### Build for Production

**Backend:**
```bash
cd server
npm start  # Use NODE_ENV=production
```

**Frontend:**
```bash
cd client
npm run build
```

### API Testing

Use curl or Postman to test endpoints:

```bash
# Test health
curl http://localhost:5000/api/health

# Get all Pokemon
curl http://localhost:5000/api/pokemon

# Generate team
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{"team": ["Pikachu"], "strategy": "make it faster"}'
```

## Project Structure

```
pokemon-team-creator/
├── server/
│   ├── config/              # Configuration
│   ├── llm/                 # LLM integration
│   ├── actions/             # Action executor
│   ├── routes/              # API routes
│   ├── utils/               # Utilities
│   ├── index.js             # Main server
│   ├── package.json
│   ├── .env.example
│   └── error.log            # Auto-generated logs
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── node_modules/        # Auto-installed
└── README.md
```

## Credits

- Pokemon data and sprites from [PokéAPI](https://pokeapi.co/)
- LLM integration via [OpenAI API](https://platform.openai.com/)
- UI built with [React](https://react.dev/)

## License

This project is part of CS 4680 coursework.

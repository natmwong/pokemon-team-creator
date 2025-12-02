# Setup Instructions

## Prerequisites

Before getting started, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Git** (optional, for version control)

## Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `server` directory with your API key:
   ```bash
   # Copy the example file
   copy .env.example .env
   ```

4. **Edit `.env`** and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`

## Frontend Setup

1. **In a new terminal, navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000` and automatically reload when you make changes.

## Using the Application

1. **Select Pokemon**: Click on Pokemon cards to add them to your team (0-6 Pokemon)
2. **Enter Strategy**: Describe what you want your team to do:
   - "Make my team bulkier"
   - "Optimize for competitive battles"
   - "Counter dragon types"
   - "Create a fast-paced offensive team"
3. **Generate Team**: Click "Generate Team" to get AI recommendations
4. **Review Results**: The AI will suggest:
   - Additional Pokemon to complete your team
   - Optimal movesets for each Pokemon
   - Recommended held items

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

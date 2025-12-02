# Pokemon Team Creator - AI Agent Architecture

## Project Overview

This is an **AI Agent** implementation for CS 4680 that creates Pokemon teams using OpenAI's LLM. The agent receives natural language requests, processes them through an LLM, and executes concrete actions based on the LLM's response.

## Requirements Fulfillment

### ✅ 1. LLM Integration Module

**Location:** `server/llm/llmClient.js`

The LLM Integration Module handles all communication with the OpenAI API:

```javascript
class LLMClient {
  async sendPrompt(prompt)           // Send prompts to LLM
  async generateTeamRecommendations() // Generate team recommendations
  async analyzeTeam(team)             // Analyze team composition
}
```

**Features:**
- Connects to OpenAI API (configurable model: `gpt-4o-mini`)
- **Error Handling**: Try-catch blocks, retry logic with exponential backoff
- **Rate Limiting**: 60 requests per 15 minutes to prevent API abuse
- **Response Validation**: Ensures LLM output is valid before processing

**Example Prompt to LLM:**
```
I need help building a Pokemon team. Here's my current team (1/6): Pikachu

My strategy request: make my team bulkier

Please recommend:
1. 1-3 additional Pokemon to complete my team
2. For each Pokemon, suggest a movepool (4 moves)
3. For each Pokemon, suggest a held item

Format your response as JSON with this structure:
{
  "recommendations": {
    "suggestedPokemon": ["pokemon1", "pokemon2"],
    "teamComposition": [...]
  }
}
```

### ✅ 2. Action Interpreter/Executor

**Location:** `server/actions/actionExecutor.js`

The Action Executor parses LLM responses and converts them into executable operations:

```javascript
class ActionExecutor {
  parseLLMResponse(llmResponse)      // Extract JSON from LLM output
  validateAndFormatResponse(data)    // Validate and format data
  executeAction(action)               // Execute concrete actions
  getExecutionLog()                   // Retrieve audit logs
}
```

**Action Types:**
1. **ADD_POKEMON** - Add Pokemon to team
2. **REMOVE_POKEMON** - Remove Pokemon from team
3. **UPDATE_MOVESET** - Update Pokemon's moves
4. **UPDATE_ITEM** - Update held item
5. **ANALYZE** - Team analysis

**Example LLM Response Processing:**
```javascript
// Raw LLM response
const llmOutput = `{
  "recommendations": {
    "suggestedPokemon": ["Alakazam", "Dragonite"],
    "teamComposition": [...]
  }
}`;

// Parser extracts and validates JSON
const parsed = actionExecutor.parseLLMResponse(llmOutput);
// Result: {
//   suggestedPokemon: ["Alakazam", "Dragonite"],
//   teamComposition: [...],
//   ...
// }
```

### ✅ 3. User Interface

**Frontend:** React-based web application

**Components:**

1. **PokemonPicker** (`client/src/components/PokemonPicker.js`)
   - Display all Pokemon with images
   - Search functionality
   - Select up to 6 Pokemon
   - Shows Pokemon types and images

2. **TeamBuilder** (`client/src/components/TeamBuilder.js`)
   - Display selected team
   - Text input for strategy request
   - "Generate Team" button
   - Loading states

3. **Recommendations** (`client/src/components/Recommendations.js`)
   - Display suggested Pokemon
   - Show team composition with moves and items
   - Display strategy explanation
   - Show tips and recommendations

**User Flow:**
```
1. User selects 0-6 Pokemon from picker
   ↓
2. User enters strategy request
   ↓
3. Click "Generate Team"
   ↓
4. Frontend sends request to backend
   ↓
5. Backend calls LLM
   ↓
6. LLM returns recommendations
   ↓
7. Action Executor parses response
   ↓
8. Results displayed to user
```

### ✅ 4. Error Handling & Safety

**Input Validation** (`server/utils/validation.js`)
```javascript
validateTeamRequest(team, strategy)  // Validate inputs
validateLLMOutput(output)            // Validate LLM output
sanitizeInput(input)                 // Remove harmful characters
```

**Validations:**
- Team size 0-6
- Non-empty Pokemon names
- Strategy max 1000 characters
- No HTML/special characters in input
- LLM output must be string
- JSON parsing with error recovery

**Safety Features:**
1. **Input Sanitization**: Remove dangerous characters, limit length
2. **Rate Limiting**: Prevent API abuse
3. **Error Recovery**: Fallback parsing for malformed responses
4. **Audit Logging**: All actions logged with timestamps
5. **User Confirmation**: Recommendations require user approval

**Rate Limiter** (`server/utils/rateLimiter.js`)
```javascript
class RateLimiter {
  isAllowed()              // Check if request is allowed
  getRemainingRequests()   // Get remaining quota
  getResetTime()          // Get when quota resets
}
```

**Logging** (`server/utils/logger.js`)
- Winston logger configuration
- Logs all API calls, errors, and actions
- Separate error and combined logs
- Console output with color formatting

### ✅ 5. API Endpoints

**Pokemon Endpoints:**
```
GET  /api/pokemon              - Get all Pokemon
GET  /api/pokemon/search/:name - Search Pokemon
GET  /api/pokemon/:id          - Get Pokemon by ID
```

**Team Endpoints:**
```
POST /api/team/generate           - Generate team recommendations
POST /api/team/analyze            - Analyze team composition
POST /api/team/suggest-movesets   - Get movesets
POST /api/team/suggest-items      - Get item recommendations
```

**Health Endpoint:**
```
GET /api/health - Server health check
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐│
│ │Pokemon Picker│  │ Team Builder │  │ Recommendations  ││
│ └──────────────┘  └──────────────┘  └──────────────────┘│
└────────────┬────────────────────────────────────────────┘
             │ HTTP Request
             ↓
┌─────────────────────────────────────────────────────────┐
│                 EXPRESS BACKEND                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │           Input Validation Layer                     ││
│ │ - Validate team (0-6 Pokemon)                       ││
│ │ - Validate strategy (max 1000 chars)                ││
│ │ - Sanitize inputs                                   ││
│ └──────────────────────────────────────────────────────┘│
│                      ↓                                    │
│ ┌──────────────────────────────────────────────────────┐│
│ │           LLM Integration Layer                      ││
│ │ - Check rate limiting (60 req/15 min)               ││
│ │ - Send prompt to OpenAI API                         ││
│ │ - Implement exponential backoff retry               ││
│ │ - Validate LLM output                               ││
│ └──────────────────────────────────────────────────────┘│
│                      ↓                                    │
│ ┌──────────────────────────────────────────────────────┐│
│ │         Action Executor Layer                        ││
│ │ - Parse LLM response (extract JSON)                 ││
│ │ - Validate parsed data                              ││
│ │ - Convert to executable actions                     ││
│ │ - Log all actions with timestamps                   ││
│ └──────────────────────────────────────────────────────┘│
└────────────┬────────────────────────────────────────────┘
             │ JSON Response
             ↓
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│         Display recommendations to user                  │
└─────────────────────────────────────────────────────────┘
```

## Configuration

**Environment Variables** (`.env`):
```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
NODE_ENV=development
API_RATE_LIMIT=60
API_RATE_LIMIT_WINDOW=900000
```

**Server**: `index.js`
- Express.js configuration
- CORS enabled for React frontend
- Error handling middleware
- 404 handler

## Example Workflow

### Step 1: User Selects Pokemon and Strategy
```javascript
selectedPokemon = ["Pikachu", "Charizard"]
strategy = "make my team bulkier and add good defenders"
```

### Step 2: Frontend Sends Request
```javascript
POST /api/team/generate
{
  "team": ["Pikachu", "Charizard"],
  "strategy": "make my team bulkier and add good defenders"
}
```

### Step 3: Backend Input Validation
```javascript
// Validate team size (2 ≤ 6) ✓
// Validate strategy length (31 ≤ 1000) ✓
// Sanitize inputs ✓
// Pass to LLM
```

### Step 4: LLM Processing
```
System Message: "You are a Pokemon team building expert..."

User Message:
"I need help building a Pokemon team. Here's my current team (2/6):
Pikachu, Charizard

My strategy request: make my team bulkier and add good defenders

Please recommend: [...format instructions...]"
```

### Step 5: LLM Response
```json
{
  "recommendations": {
    "suggestedPokemon": ["Blastoise", "Alakazam", "Gengar"],
    "teamComposition": [
      {
        "name": "Blastoise",
        "moves": ["Hydro Pump", "Ice Beam", "Earthquake", "Recover"],
        "heldItem": "Assault Vest",
        "reasoning": "Provides bulk and special attack coverage"
      }
    ],
    "teamStrategy": "Balanced team with good type coverage",
    "tips": ["Use items that boost bulk...", "Consider abilities..."]
  }
}
```

### Step 6: Action Executor Parsing
```javascript
const parsed = actionExecutor.parseLLMResponse(llmResponse);
// Validates JSON structure
// Ensures all fields are present
// Logs action execution
```

### Step 7: Response to User
```javascript
{
  "success": true,
  "recommendations": {
    "suggestedPokemon": ["Blastoise", "Alakazam", "Gengar"],
    "teamComposition": [...],
    "teamStrategy": "Balanced team...",
    "tips": [...]
  },
  "execution": {
    "type": "GENERATE_TEAM",
    "success": true,
    "timestamp": "2024-11-26T10:30:45.123Z"
  },
  "remainingRequests": 59
}
```

## Error Handling Examples

### Rate Limit Error
```javascript
// Status: 429
{
  "success": false,
  "error": "Rate limit exceeded",
  "resetTime": "2024-11-26T10:45:00.000Z"
}
```

### Validation Error
```javascript
// Status: 400
{
  "success": false,
  "errors": [
    "Team cannot have more than 6 Pokemon",
    "Strategy cannot be empty"
  ]
}
```

### API Error
```javascript
// Status: 500
{
  "success": false,
  "error": "LLM API error: Connection timeout after 3 retries"
}
```

## Project Files Structure

```
pokemon-team-creator/
│
├── README.md                          # Project overview
├── SETUP.md                          # Setup instructions
├── AI_AGENT_ARCHITECTURE.md          # This file
│
├── server/                           # Backend (Node.js)
│   ├── index.js                      # Express server entry point
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment variables template
│   │
│   ├── config/
│   │   └── pokemonData.js            # Pokemon database & image URLs
│   │
│   ├── llm/
│   │   └── llmClient.js              # LLM integration (OpenAI API)
│   │
│   ├── actions/
│   │   └── actionExecutor.js         # Action parser & executor
│   │
│   ├── routes/
│   │   ├── health.js                 # Health check endpoint
│   │   ├── pokemon.js                # Pokemon API routes
│   │   └── team.js                   # Team API routes
│   │
│   └── utils/
│       ├── logger.js                 # Winston logger
│       ├── validation.js             # Input validation
│       └── rateLimiter.js            # Rate limiting
│
└── client/                           # Frontend (React)
    ├── package.json                  # Dependencies
    ├── public/
    │   └── index.html                # HTML template
    │
    └── src/
        ├── index.js                  # React entry point
        ├── App.js                    # Main app component
        ├── api.js                    # API client
        │
        ├── components/
        │   ├── PokemonPicker.js      # Pokemon selection
        │   ├── TeamBuilder.js        # Team & strategy input
        │   └── Recommendations.js    # Display recommendations
        │
        └── styles/
            ├── index.css             # Global styles
            ├── App.css               # App styles
            ├── PokemonPicker.css     # Picker styles
            ├── TeamBuilder.css       # Builder styles
            └── Recommendations.css   # Recommendation styles
```

## Testing the Agent

### Manual Testing

1. **Start Backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm install
   npm start
   ```

3. **Test Endpoints with curl:**
   ```bash
   # Get all Pokemon
   curl http://localhost:5000/api/pokemon
   
   # Generate team
   curl -X POST http://localhost:5000/api/team/generate \
     -H "Content-Type: application/json" \
     -d '{"team": ["Pikachu"], "strategy": "make it faster"}'
   ```

### Expected Behavior

1. **Valid Request:**
   - ✓ Input validation passes
   - ✓ LLM receives prompt
   - ✓ Response parsed successfully
   - ✓ Recommendations displayed

2. **Invalid Request:**
   - ✓ Validation error returned
   - ✓ Error message shown to user
   - ✓ Request logged

3. **Rate Limit Exceeded:**
   - ✓ 429 response returned
   - ✓ Reset time provided
   - ✓ User warned

## Key Implementation Details

### LLM Prompt Engineering
The prompts are carefully crafted to:
- Request JSON format for easy parsing
- Specify exact structure expected
- Include examples for clarity
- Request reasoning for recommendations

### Response Parsing Strategy
1. Try to extract JSON from response
2. Parse JSON with error handling
3. Validate required fields
4. Fall back to text parsing if JSON fails

### Rate Limiting Algorithm
```javascript
// Sliding window approach
- Track timestamp of each request
- Remove old requests outside window (15 minutes)
- Check if new request within limit (60 max)
- Return remaining quota
```

### Logging Strategy
```javascript
- INFO: Normal operations (API calls, team generation)
- WARN: Retries, fallback behaviors
- ERROR: API failures, parsing errors, validation errors
- All logs include: timestamp, level, message, service info
```

## Compliance with Course Requirements

| Requirement | Implementation | Location |
|------------|---------------|---------| 
| LLM Integration | OpenAI API connection, error handling, retry logic | `server/llm/llmClient.js` |
| Action Interpreter | Parse LLM output, extract commands, convert to actions | `server/actions/actionExecutor.js` |
| User Interface | React web app with Pokemon picker, strategy input, results | `client/src/components/*` |
| Error Handling | Input validation, API error handling, rate limiting | `server/utils/validation.js` |
| Safety Checks | Input sanitization, output validation, confirmable actions | Throughout backend |
| Logging | Winston logger, action audit trail, timestamps | `server/utils/logger.js` |

---

**Created for CS 4680 - AI Agent Course Project**

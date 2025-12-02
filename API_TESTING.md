# API Testing Guide - Pokemon Team Creator

This guide shows how to test all API endpoints using curl, Postman, or your browser.

## Prerequisites

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. API is available at: `http://localhost:5000/api`

## Health Check

### Test Server is Running
```bash
curl http://localhost:5000/api/health
```

**Expected Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-26T10:30:45.123Z",
  "uptime": 45.234
}
```

---

## Pokemon Endpoints

### Get All Pokemon
Returns list of all available Pokemon with images and types.

```bash
curl http://localhost:5000/api/pokemon
```

**Expected Response (200):**
```json
{
  "count": 45,
  "pokemon": [
    {
      "id": 1,
      "name": "Bulbasaur",
      "types": ["Grass", "Poison"],
      "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/..."
    },
    ...
  ]
}
```

### Search Pokemon by Name
Search for Pokemon by partial name (case-insensitive).

```bash
curl http://localhost:5000/api/pokemon/search/pika
```

**Expected Response (200):**
```json
{
  "results": [
    {
      "id": 25,
      "name": "Pikachu",
      "types": ["Electric"],
      "imageUrl": "..."
    }
  ]
}
```

**Not Found Response (404):**
```json
{
  "error": "Pokemon not found"
}
```

### Get Pokemon by ID
Get specific Pokemon by its Pokedex ID.

```bash
curl http://localhost:5000/api/pokemon/25
```

**Expected Response (200):**
```json
{
  "id": 25,
  "name": "Pikachu",
  "types": ["Electric"],
  "imageUrl": "..."
}
```

---

## Team Endpoints

### Generate Team Recommendations ⭐ (Main Endpoint)

Generate team recommendations based on current team and strategy.

```bash
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{
    "team": ["Pikachu", "Charizard"],
    "strategy": "make my team bulkier and add special attackers"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "recommendations": {
    "suggestedPokemon": ["Alakazam", "Dragonite", "Blastoise"],
    "teamComposition": [
      {
        "name": "Blastoise",
        "moves": ["Hydro Pump", "Ice Beam", "Earthquake", "Recover"],
        "heldItem": "Assault Vest",
        "reasoning": "Provides defensive coverage and special attack"
      }
    ],
    "teamStrategy": "Balanced team with good type coverage",
    "tips": ["Use items that boost...", "Consider abilities..."]
  },
  "execution": {
    "type": "GENERATE_TEAM",
    "success": true,
    "timestamp": "2024-11-26T10:30:45.123Z"
  },
  "remainingRequests": 59
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "errors": [
    "Team cannot have more than 6 Pokemon",
    "Strategy cannot be empty"
  ]
}
```

**Rate Limit Response (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "resetTime": "2024-11-26T10:45:00.000Z"
}
```

**API Error Response (500):**
```json
{
  "success": false,
  "error": "LLM API error: Connection timeout after 3 retries"
}
```

### Analyze Team

Analyze strengths, weaknesses, and type coverage of a team.

```bash
curl -X POST http://localhost:5000/api/team/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "team": ["Pikachu", "Charizard", "Blastoise"]
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "analysis": "Type Coverage Analysis:\n\nElectric, Fire, Flying, Water types covered...",
  "parsed": {
    "suggestedPokemon": [],
    "teamComposition": [],
    "teamStrategy": "Analysis shows...",
    "tips": ["Consider adding Ground type...", "Rock weakness..."]
  }
}
```

**Empty Team Error (400):**
```json
{
  "error": "Team must be a non-empty array"
}
```

### Suggest Movesets

Get recommended movesets for specific Pokemon.

```bash
curl -X POST http://localhost:5000/api/team/suggest-movesets \
  -H "Content-Type: application/json" \
  -d '{
    "pokemon": ["Pikachu", "Charizard", "Alakazam"]
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "movesets": {
    "suggestedPokemon": [],
    "teamComposition": [],
    "teamStrategy": "",
    "tips": [
      "Pikachu: Use Thunderbolt for reliability...",
      "Charizard: Flamethrower provides good coverage...",
      "Alakazam: Psychic is its STAB move..."
    ]
  },
  "remainingRequests": 58
}
```

### Suggest Items

Get recommended held items for specific Pokemon.

```bash
curl -X POST http://localhost:5000/api/team/suggest-items \
  -H "Content-Type: application/json" \
  -d '{
    "pokemon": ["Pikachu", "Charizard", "Blastoise"]
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "items": {
    "suggestedPokemon": [],
    "teamComposition": [],
    "teamStrategy": "",
    "tips": [
      "Pikachu: Light Ball doubles attack power",
      "Charizard: Choice Specs boosts special attack",
      "Blastoise: Assault Vest provides bulk"
    ]
  },
  "remainingRequests": 57
}
```

---

## Error Scenarios

### Scenario 1: Missing API Key
**Error:** `Error: OPENAI_API_KEY environment variable is required`

**Fix:** Add `OPENAI_API_KEY=sk-...` to `.env` file

### Scenario 2: Invalid JSON
```bash
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{"invalid json}'
```

**Response (400):**
```json
{
  "error": "Bad request"
}
```

### Scenario 3: Empty Team with Required Strategy
```bash
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{"team": [], "strategy": ""}'
```

**Response (400):**
```json
{
  "success": false,
  "errors": ["Strategy cannot be empty"]
}
```

### Scenario 4: Too Many Pokemon
```bash
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{"team": ["P1", "P2", "P3", "P4", "P5", "P6", "P7"], "strategy": "test"}'
```

**Response (400):**
```json
{
  "success": false,
  "errors": ["Team cannot have more than 6 Pokemon"]
}
```

### Scenario 5: Rate Limit Exceeded
After 60 requests in 15 minutes:

```bash
curl -X POST http://localhost:5000/api/team/generate \
  -H "Content-Type: application/json" \
  -d '{"team": ["Pikachu"], "strategy": "test"}'
```

**Response (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "resetTime": "2024-11-26T10:45:00.000Z"
}
```

---

## Testing with Postman

### 1. Create New Request
- Method: POST
- URL: `http://localhost:5000/api/team/generate`

### 2. Headers Tab
- Key: `Content-Type`
- Value: `application/json`

### 3. Body Tab
- Select: `raw` and `JSON`
- Paste:
  ```json
  {
    "team": ["Pikachu"],
    "strategy": "make my team faster"
  }
  ```

### 4. Send
- Click "Send" button
- View response in lower panel

---

## Testing in Browser Console

```javascript
// Test with fetch API
fetch('http://localhost:5000/api/pokemon')
  .then(res => res.json())
  .then(data => console.log(data))

// Generate team
fetch('http://localhost:5000/api/team/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    team: ['Pikachu'],
    strategy: 'make my team bulkier'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

---

## Testing Checklist

- [ ] Health check returns 200
- [ ] Get all Pokemon returns array with images
- [ ] Search finds Pokemon by name
- [ ] Get Pokemon by ID works
- [ ] Generate team with valid inputs succeeds
- [ ] Generate team validates team size (>6 fails)
- [ ] Generate team validates strategy (empty fails)
- [ ] Analyze team works with valid team
- [ ] Rate limiting works (error after 60 requests)
- [ ] Error logging works (check server/error.log)
- [ ] Frontend connects and displays results

---

## Performance Notes

- Typical response time: 2-5 seconds (includes LLM call)
- Rate limit: 60 requests per 15 minutes
- Max team size: 6 Pokemon
- Max strategy length: 1000 characters
- Logs stored in: `server/error.log` and `server/combined.log`

---

## Debugging Tips

1. **Check Server Logs**
   ```bash
   tail -f server/combined.log
   ```

2. **Check Error Logs**
   ```bash
   tail -f server/error.log
   ```

3. **Verify API Key**
   ```bash
   cat server/.env | grep OPENAI_API_KEY
   ```

4. **Test with Simple Request**
   ```bash
   curl http://localhost:5000/api/health
   ```

5. **Check Network in Browser**
   - F12 → Network tab
   - Make request
   - Click request
   - View request/response headers

---

**Happy Testing! 🧪**

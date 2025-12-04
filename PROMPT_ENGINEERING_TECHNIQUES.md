# Prompt Engineering Techniques Used in Pokemon Team Creator

## Summary
This document details the prompt engineering and input handling techniques used to intake user input and optimize LLM responses for team recommendations.

---

## 🎯 Frontend Input Collection Techniques

### 1. **Structured Form Inputs**
- **Pokemon Selection**: Visual card-based selection (0-6 limit)
  - Users click cards to add/remove Pokemon
  - Clear visual feedback with selection badges
  - Search functionality for easier discovery
  
- **Strategy Description**: Natural language text area
  - Open-ended text input (max 1000 characters)
  - Helper text with examples: "make it bulkier", "counter water types", "optimize for speed"
  - Real-time character count validation

### 2. **Client-Side Validation**
- **Strategy Field**: Requires non-empty string before submission
- **Pokemon Selection**: 0-6 Pokemon constraint enforced at UI level
- **Delete Buttons**: Allow users to remove individual Pokemon before sending
- **Escape Key Support**: Cancel requests mid-generation for better UX

---

## 🔐 Backend Input Processing Techniques

### 3. **Input Sanitization**
```javascript
// Sanitize each input before LLM processing
team = team.map(p => sanitizeInput(p));
strategy = sanitizeInput(strategy);
```
- Removes special characters and potential injection attacks
- Prevents prompt injection vulnerabilities
- Normalizes whitespace

### 4. **Strict Validation Rules**
Implemented in `server/utils/validation.js`:
- Team size: 0-6 Pokemon (enforced)
- Strategy length: 1-1000 characters (enforced)
- Type checking: Ensure team is array, strategy is string
- Empty value checks: Reject empty Pokemon names and empty strategies
- Length limits: Prevent excessively long individual Pokemon names

---

## 💬 Prompt Engineering Techniques

### 5. **System Role Definition**
```javascript
{
  role: 'system',
  content: 'You are a Pokemon team building expert. Provide concise, actionable recommendations for Pokemon teams.'
}
```
- Sets expert persona to improve response quality
- Establishes context for domain-specific knowledge
- Ensures consistent tone and expertise level

### 6. **Structured User Prompt**
```
I need help building a Pokemon team. Here's my current team (2/6): Pikachu, Charizard

My strategy request: make my team bulkier

Please provide comprehensive recommendations including:
1. 1-3 additional Pokemon to complete my team
2. For EACH Pokemon in the final team:
   - Optimal 4-move moveset
   - Best held item with explanation
   - How this Pokemon fits into the overall team strategy
```

**Techniques Used:**
- **Clear Context**: Current team size shown as `(2/6)` for clarity
- **Numbered Instructions**: Breaks down requirements into clear steps
- **Specific Output Format**: Tells LLM exactly what to recommend
- **Constraints**: "1-3 additional Pokemon", "4-move moveset"

### 7. **Explicit JSON Formatting Request**
```javascript
Format your response as JSON with this structure:
{
  "recommendations": {
    "suggestedPokemon": ["pokemon1", "pokemon2"],
    "teamComposition": [
      {
        "name": "pokemon_name",
        "role": "attacker/defender/support",
        "moves": [
          {"name": "move1", "type": "Fire", "purpose": "primary damage"}
        ],
        "heldItem": "item_name",
        "reasoning": "why this Pokemon is recommended"
      }
    ],
    "teamStrategy": "overall strategy explanation"
  }
}
```

**Techniques Used:**
- **Schema Definition**: Provides exact JSON structure expected
- **Field Specifications**: Defines each required field
- **Example Values**: Shows format with realistic examples
- **Nested Structure**: Ensures organized, parseable responses

### 8. **Contextual Information Injection**
- **Strategy User Input**: Directly embedded in prompt
  - User: "make my team bulkier" → Prompt includes exact phrasing
  - User: "counter dragon types" → Prompt preserves user intent
- **Current Team Context**: Included to guide recommendations
- **Team Composition Status**: Shows how many slots remain `(2/6)`

### 9. **Multi-Step Reasoning Prompts**
```
Please provide comprehensive recommendations including:
1. Type coverage analysis
2. Strengths and weaknesses
3. Synergy analysis
4. Specific usage tips
```

**Techniques Used:**
- **Sequential Instructions**: Builds output step-by-step
- **Reasoning Extraction**: "explain WHY" for each recommendation
- **Multiple Perspectives**: Analyzes from coverage, synergy, and practical angles

### 10. **Output Validation Criteria**
- **Field Presence**: Validates all required JSON fields exist
- **Type Checking**: Ensures arrays/objects are correct types
- **Fallback Parsing**: If JSON parsing fails, extracts information from text response
- **Error Recovery**: Returns meaningful error messages if parsing fails

---

## 🛡️ Error Handling & Robustness

### 11. **Rate Limiting Strategy**
- **Sliding Window**: 60 requests per 15 minutes
- **Remaining Quota**: Client informed of remaining requests
- **Reset Time**: Provided to users when limit exceeded
- **User-Friendly Messages**: "Rate limit exceeded. Please wait."

### 12. **Retry Logic with Exponential Backoff**
```javascript
for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
  try {
    // Attempt LLM call
  } catch (error) {
    if (attempt < maxRetries) {
      // Exponential backoff: wait longer with each retry
      await this.delay(Math.pow(2, attempt) * 1000);
    }
  }
}
```

**Techniques Used:**
- **Resilience**: Retries transient API failures automatically
- **Exponential Backoff**: 2s, 4s, 8s delays prevent overwhelming API
- **Max Retries**: 3 attempts total before failing

### 13. **Logging for Debugging**
- **INFO Level**: Normal operations tracked
  - User inputs logged (sanitized)
  - LLM requests/responses logged
  - Team generation attempts logged
- **ERROR Level**: Failures captured with context
  - Input validation errors
  - LLM API errors
  - Parsing errors
- **Audit Trail**: Timestamp, service, message for debugging

---

## 🔄 Request Cancellation & Flow Control

### 14. **AbortController Integration**
```javascript
// User can cancel mid-request
const controller = new AbortController();
const response = await teamAPI.generateTeam(team, strategy, controller.signal);

// Cancel button triggers abort
if (abortController) {
  abortController.abort();
}
```

**Techniques Used:**
- **Request Cancelation**: Stops API call if user cancels
- **Escape Key Support**: ESC key triggers abort
- **UI Feedback**: Loading spinner shows ongoing request
- **State Cleanup**: All loading states cleared on cancel

---

## 📊 Response Processing Pipeline

### 15. **Multi-Stage Parsing Strategy**
```
LLM Response Text
    ↓
1. Try JSON.parse()
    ↓ (if fails)
2. Extract JSON from text
    ↓ (if fails)
3. Parse as structured text
    ↓
Validated Output Structure
```

### 16. **Field Extraction & Transformation**
- **Pokemon Names**: Extracted and case-normalized
- **Move Details**: Type and purpose extracted
- **Item Reasoning**: Captured separately for explanation
- **Team Strategy**: Consolidated for display

---

## 🎨 User Experience Optimizations

### 17. **Progressive Disclosure**
- **Modal Popups**: Recommendations don't replace main UI
- **Loading States**: Clear spinner feedback during generation
- **Expandable Details**: "My Teams" page shows Pokemon gallery
- **Team Preview**: Shows current selected team before generating

### 18. **Contextual Help & Examples**
```
"Describe what you'd like your team to do. Examples: 
'make it bulkier', 'counter dragon types', 
'optimize for competitive'"
```

- **Examples Provided**: Guides users on input format
- **Real-time Feedback**: Shows character count
- **Error Messages**: Specific guidance on what went wrong

---

## 📋 Summary of Techniques

| Technique | Location | Purpose |
|-----------|----------|---------|
| Structured Forms | Frontend | Constrained, reliable input collection |
| Input Sanitization | Backend validation | Security & consistency |
| System Role Definition | LLM prompt | Expertise & tone setting |
| Explicit JSON Schema | LLM prompt | Parseable, structured output |
| Numbered Instructions | LLM prompt | Clear step-by-step guidance |
| Contextual Injection | LLM prompt | Preserve user intent |
| Field Validation | Response parsing | Quality assurance |
| Retry Logic | API calls | Resilience |
| Rate Limiting | API gateway | Fair usage |
| AbortController | HTTP client | User control |
| Error Recovery | All layers | Graceful degradation |
| Logging | Backend | Debugging & audit trail |

---

## 🎯 Key Engineering Principles Applied

1. **Input Validation at Multiple Layers**: Frontend → Backend → LLM parsing
2. **Clear Communication**: User sees what's being sent, knows when it's being processed
3. **Graceful Degradation**: Errors don't break the entire flow
4. **User Control**: Cancel, delete, retry options available
5. **Security First**: Sanitization, injection prevention, rate limiting
6. **Explicit Structure**: JSON schemas prevent ambiguity
7. **Feedback Loops**: Real-time validation, loading states, error messages
8. **Resilience**: Retries, fallbacks, error recovery strategies

# Pokemon Team Creator - AI Agent Project

An AI-powered Pokemon team creation assistant that helps users build optimized Pokemon teams with recommended movesets and held items.

## Project Overview

This project implements an AI Agent that:
- Connects to an LLM (OpenAI API) to interpret natural language requests
- Parses LLM outputs to extract actionable commands
- Executes concrete actions (team generation, recommendations, analysis)
- Provides a user-friendly web interface for Pokemon team management

## Features

- **Pokemon Selection**: Pick up to 6 Pokemon for your team with an interactive picker (shows images and names)
- **LLM Integration**: Send team composition and strategy requests to OpenAI API
- **Team Optimization**: Generate suggested Pokemon to complete your team
- **Movesets & Items**: Receive AI-recommended movesets and held items for each Pokemon
- **Strategy Support**: Request specific team adjustments (e.g., "make my team bulkier", "counter dragon types")
- **Safety & Validation**: Error handling, API rate limiting, and output validation

## Project Structure

```
pokemon-team-creator/
├── server/              # Node.js Express backend
│   ├── config/         # Configuration files
│   ├── llm/            # LLM integration module
│   ├── actions/        # Action executor module
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.js        # Express server entry point
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── App.js      # Main App component
│   │   └── index.js    # React entry point
│   ├── public/         # Static files
│   └── package.json
└── README.md
```

## Technology Stack

**Backend:**
- Node.js & Express
- OpenAI API (LLM Integration)
- Error handling & logging

**Frontend:**
- React
- Axios (HTTP client)
- CSS/Bootstrap (styling)

## Setup Instructions

### Prerequisites
- Node.js 14+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   cd pokemon-team-creator
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   echo "OPENAI_API_KEY=your_key_here" > .env
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/pokemon` - Get list of all Pokemon
- `POST /api/team/analyze` - Analyze current team
- `POST /api/team/generate` - Generate team recommendations
- `POST /api/team/suggest-movesets` - Get movesets for Pokemon
- `POST /api/team/suggest-items` - Get item recommendations

## Usage

1. Select 0-6 Pokemon from the picker
2. Input a strategy request (e.g., "make my team bulkier", "optimize this team")
3. Click "Generate Team" to send the request to the LLM
4. Review AI-generated recommendations:
   - Suggested Pokemon to add
   - Recommended movesets
   - Suggested held items
5. Accept or modify suggestions as needed

## Error Handling

- API errors are caught and displayed to the user
- Rate limiting is implemented with exponential backoff
- All actions are logged for auditability
- Confirmation required for accepting AI recommendations

## Safety Features

- Input validation on all user requests
- LLM output parsing and validation
- No destructive operations without confirmation
- All actions logged with timestamps
- Error recovery and user feedback

## License

This project is part of CS 4680 coursework.

# Pokemon Team Creator - AI Agent Project

An AI-powered Pokemon team creation assistant that helps users build optimized Pokemon teams with recommended movesets and held items.

## Project Overview

This project implements an AI Agent that:
- Connects to an LLM (OpenAI API) to interpret natural language requests
- Parses LLM outputs to extract actionable commands
- Executes concrete actions (team generation, recommendations, analysis)
- Provides a user-friendly web interface for Pokemon team management

## Features

### Core Features
- **Pokemon Selection**: Pick up to 6 Pokemon for your team with an interactive picker (shows images and names)
- **Delete Pokemon**: Remove individual Pokemon from your team during building
- **LLM Integration**: Send team composition and strategy requests to OpenAI API
- **Team Optimization**: Generate suggested Pokemon to complete your team
- **Movesets & Items**: Receive AI-recommended movesets and held items for each Pokemon
- **Strategy Support**: Request specific team adjustments (e.g., "make my team bulkier", "counter dragon types")

### Authentication & Team Management
- **User Authentication**: Email/password sign up and login with Firebase
- **Save Teams**: Save your created teams to Firestore with custom names and descriptions
- **Manage Teams**: Load, rename, and delete saved teams
- **Team Gallery**: View saved teams with Pokemon images and strategy details
- **Persistent Storage**: All teams synced to Firebase Firestore

### UI/UX Improvements
- **Modern Navigation**: Top navbar with page switching between Team Builder and My Teams
- **Modal Popups**: Recommendations and save dialogs don't block the main interface
- **Pokéball Theme**: Red and gold color scheme with professional styling
- **Loading States**: Clear feedback during API calls with cancel functionality
- **Error Handling**: User-friendly error messages and graceful timeout handling
- **Escape Key Support**: Press ESC to close modals from anywhere
- **Safety & Validation**: Input validation, rate limiting, request cancellation

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
- Rate limiting middleware

**Frontend:**
- React 18.2.0
- Firebase Authentication & Firestore
- Axios (HTTP client)
- CSS3 with gradients and animations

**Database:**
- Firebase Firestore - Real-time team persistence
- Firebase Authentication - User account management

## Setup Instructions

### Prerequisites
- Node.js 14+
- npm or yarn
- OpenAI API key
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   cd pokemon-team-creator
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env file with:
   # OPENAI_API_KEY=your_key_here
   # PORT=5000
   # NODE_ENV=development
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   # Create .env file with Firebase config:
   # REACT_APP_FIREBASE_API_KEY=your_key
   # REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   # REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   # REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   # REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   # REACT_APP_FIREBASE_APP_ID=your_app_id
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Pokemon Endpoints
- `GET /api/pokemon` - Get list of all Pokemon
- `GET /api/pokemon/search/:name` - Search Pokemon by name
- `GET /api/pokemon/:id` - Get Pokemon details

### Team Endpoints
- `POST /api/team/generate` - Generate team recommendations
- `POST /api/team/analyze` - Analyze current team
- `POST /api/team/suggest-movesets` - Get movesets for Pokemon
- `POST /api/team/suggest-items` - Get item recommendations

## Usage

1. **Sign Up or Login** with your email and password
2. **Select Pokemon** (0-6) from the picker in the Team Builder
3. **Delete Pokemon** by clicking the ✕ button on team member cards
4. **Input Strategy** - Describe what you want (e.g., "make my team bulkier")
5. **Generate Recommendations** - Click "Generate Team" to get AI suggestions
6. **Save Your Team** - Click "Save This Team" and give it a name
7. **Manage Teams** - Go to "My Teams" to view, rename, or delete saved teams
8. **Load Saved Teams** - Click "Load This Team" to continue editing
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

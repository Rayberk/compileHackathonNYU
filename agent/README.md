# Dubai RTA City Planning Agent 🏙️

AI-powered city planning assistant for Dubai RTA using Google's Agent Development Kit (ADK).

## Quick Start

### 1. Setup
```bash
cd agent
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### 3. Run
```bash
python -m uvicorn agent.api_server:app --host 0.0.0.0 --port 8080 --reload
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/chat` | POST | Send message to agent |
| `/chat/coordinates` | POST | Send message with map coordinates |
| `/sessions` | GET | List all sessions |
| `/sessions` | POST | Create new session |
| `/sessions/{id}` | DELETE | Delete session |
| `/sessions/{id}/history` | GET | Get session history |

## Frontend Integration Example

```javascript
// Basic chat
const response = await fetch('http://localhost:8080/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Analyze transport coverage in Dubai Marina",
    session_id: "optional-session-id"
  })
});

// Chat with map coordinates
const response = await fetch('http://localhost:8080/chat/coordinates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What's the public transport situation here?",
    latitude: 25.0657,
    longitude: 55.1389,
    radius_km: 2.0,
    session_id: "optional-session-id"
  })
});
```

## Agent Capabilities

1. **ML Predictions** - Get traffic/transport predictions via your ML API
2. **Transport Analysis** - Analyze public transport coverage by area name
3. **Area Statistics** - Get stats for map-selected regions
4. **Google Search** - Real-time web search for current Dubai transport info

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Gemini API key | Required |
| `ML_API_URL` | ML prediction API | `http://localhost:8000/predict` |
| `AGENT_MODEL` | Gemini model | `gemini-2.0-flash` |

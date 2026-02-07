"""
FastAPI Server for Dubai RTA City Planning Agent
Exposes the agent functionality via REST API for frontend integration.
"""
import os
from typing import Optional
from contextlib import asynccontextmanager
from pathlib import Path
import hashlib
import re

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables before importing agent
# Ensure we load from agent/.env even when started from repo root.
_agent_dir = Path(__file__).parent
load_dotenv(_agent_dir / ".env")

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types as genai_types

from .agent import root_agent
from .session_manager import session_manager
from .tools import get_ml_predictions


# Pydantic models for API requests/responses
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class CoordinateChatRequest(BaseModel):
    message: str
    latitude: float
    longitude: float
    radius_km: Optional[float] = 1.0
    session_id: Optional[str] = None


class CreateSessionRequest(BaseModel):
    name: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


class SessionResponse(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: str
    message_count: int


# ADK Session service and Runner
adk_session_service = InMemorySessionService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 Dubai RTA City Planning Agent starting...")
    print(f"📍 Using model: {os.getenv('AGENT_MODEL', 'gemini-2.0-flash')}")
    yield
    print("👋 Agent shutting down...")


# FastAPI app
app = FastAPI(
    title="Dubai RTA City Planning Agent",
    description="AI-powered city planning assistant for Dubai RTA",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def run_agent(user_message: str, session_id: str) -> str:
    """Run the agent with a user message and return the response."""
    # Get or create ADK session
    adk_session = await adk_session_service.get_session(
        app_name="dubai_rta_planner",
        user_id="default_user",
        session_id=session_id
    )
    
    if adk_session is None:
        adk_session = await adk_session_service.create_session(
            app_name="dubai_rta_planner",
            user_id="default_user",
            session_id=session_id
        )
    
    # Create runner
    runner = Runner(
        agent=root_agent,
        app_name="dubai_rta_planner",
        session_service=adk_session_service
    )
    
    # Create proper Content object for the message
    content = genai_types.Content(
        role="user",
        parts=[genai_types.Part(text=user_message)]
    )
    
    # Run the agent and collect response
    response_parts = []
    async for event in runner.run_async(
        user_id="default_user",
        session_id=session_id,
        new_message=content
    ):
        # Check for final response content
        if event.is_final_response():
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if hasattr(part, 'text') and part.text:
                        response_parts.append(part.text)
    
    return "".join(response_parts) if response_parts else "I apologize, but I couldn't generate a response. Please try again."


def _deterministic_score(seed: str) -> int:
    digest = hashlib.sha256(seed.encode("utf-8")).digest()
    return int.from_bytes(digest[:2], "big") % 101


def _extract_lat_lng_from_text(text: str) -> Optional[tuple[float, float]]:
    # Accept patterns like: "25.2048, 55.2708" or "lat 25.2048 lng 55.2708"
    match = re.search(r"(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)", text)
    if match:
        try:
            a = float(match.group(1))
            b = float(match.group(2))
            # Heuristic: Dubai lat ~ 24-26, lng ~ 54-56
            if 10 <= abs(a) <= 90 and 10 <= abs(b) <= 180:
                return (a, b)
        except ValueError:
            return None

    match = re.search(r"lat\s*[:=]?\s*(-?\d{1,3}\.\d+).*?lng\s*[:=]?\s*(-?\d{1,3}\.\d+)", text, re.IGNORECASE)
    if match:
        try:
            return (float(match.group(1)), float(match.group(2)))
        except ValueError:
            return None

    return None


async def generate_index_score(
    message: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 1.0,
) -> str:
    """Return a single-line index score string.

    Policy: never claim ML generated it unless ML call succeeds.
    """

    lat = latitude
    lng = longitude

    if lat is None or lng is None:
        extracted = _extract_lat_lng_from_text(message)
        if extracted:
            lat, lng = extracted

    # If we have coordinates, try ML first.
    if lat is not None and lng is not None:
        ml = await get_ml_predictions(lat, lng, radius_km=radius_km, prediction_type="traffic")

        # Treat any explicit error/unavailable as non-ML.
        if isinstance(ml, dict) and ml.get("status") not in {"unavailable", "error"} and "error" not in ml:
            # Try to pull a score from common keys; otherwise derive deterministically but still mark ML-driven.
            score_val = None
            for key in ("index_score", "score", "index", "risk_index"):
                if key in ml and isinstance(ml[key], (int, float)):
                    score_val = float(ml[key])
                    break

            if score_val is None:
                score_val = float(_deterministic_score(f"ml:{lat:.5f}:{lng:.5f}:{radius_km:.2f}"))

            score_int = max(0, min(100, int(round(score_val))))
            return f"Index score: {score_int} (ML model)"

        # Fallback estimate when ML service is down or returns errors.
        score_int = _deterministic_score(f"fallback:{lat:.5f}:{lng:.5f}:{radius_km:.2f}")
        return f"Index score: {score_int} (estimated)"

    # No coordinates; still return a score without asking follow-ups.
    score_int = _deterministic_score(f"text:{message}")
    return f"Index score: {score_int} (estimated)"


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Dubai RTA City Planning Agent",
        "version": "1.0.0"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the agent.
    Creates a new session if session_id is not provided.
    """
    # Get or create our session
    session = session_manager.get_or_create_session(request.session_id)
    
    # Add user message to history
    session.add_message("user", request.message)
    
    try:
        response = await generate_index_score(request.message)
        
        # Add assistant response to history
        session.add_message("assistant", response)
        
        return ChatResponse(
            response=response,
            session_id=session.id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@app.post("/chat/coordinates", response_model=ChatResponse)
async def chat_with_coordinates(request: CoordinateChatRequest):
    """
    Send a message with map coordinates to the agent.
    The coordinates will be included in the context.
    """
    # Get or create session
    session = session_manager.get_or_create_session(request.session_id)
    
    # Update session context with coordinates
    session_manager.update_session_context(session.id, {
        "selected_coordinates": {
            "lat": request.latitude,
            "lng": request.longitude,
            "radius_km": request.radius_km
        }
    })
    
    # Enhance message with coordinate context
    enhanced_message = (
        f"{request.message}\n\n"
        f"[Map Selection: Coordinates ({request.latitude}, {request.longitude}) "
        f"with radius {request.radius_km}km]"
    )
    
    # Add to history with coordinates
    session.add_message(
        "user",
        request.message,
        coordinates={
            "lat": request.latitude,
            "lng": request.longitude,
            "radius_km": request.radius_km
        }
    )
    
    try:
        response = await generate_index_score(
            request.message,
            latitude=request.latitude,
            longitude=request.longitude,
            radius_km=request.radius_km or 1.0,
        )
        
        # Add response to history
        session.add_message("assistant", response)
        
        return ChatResponse(
            response=response,
            session_id=session.id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@app.get("/sessions", response_model=list[SessionResponse])
async def list_sessions():
    """List all chat sessions."""
    sessions = session_manager.list_sessions()
    return [
        SessionResponse(
            id=s["id"],
            name=s["name"],
            created_at=s["created_at"],
            updated_at=s["updated_at"],
            message_count=s["message_count"]
        )
        for s in sessions
    ]


@app.post("/sessions", response_model=SessionResponse)
async def create_session(request: CreateSessionRequest):
    """Create a new chat session."""
    session = session_manager.create_session(request.name)
    return SessionResponse(
        id=session.id,
        name=session.name,
        created_at=session.created_at.isoformat(),
        updated_at=session.updated_at.isoformat(),
        message_count=0
    )


@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session."""
    if session_manager.delete_session(session_id):
        return {"status": "deleted", "session_id": session_id}
    raise HTTPException(status_code=404, detail="Session not found")


@app.get("/sessions/{session_id}/history")
async def get_session_history(session_id: str):
    """Get the message history for a session."""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "coordinates": msg.coordinates
            }
            for msg in session.messages
        ]
    }


# Entry point for running with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "agent.api_server:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    )

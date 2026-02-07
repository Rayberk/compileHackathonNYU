"""
Session Manager for Multi-Chat Support
Handles multiple concurrent chat sessions with separate contexts.
"""
import uuid
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class ChatMessage:
    """Represents a single message in a chat session."""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    coordinates: Optional[dict] = None  # If message includes map selection


@dataclass
class ChatSession:
    """Represents a chat session with its history and context."""
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    messages: list[ChatMessage] = field(default_factory=list)
    context: dict = field(default_factory=dict)  # For storing area selections, etc.
    
    def add_message(self, role: str, content: str, coordinates: Optional[dict] = None):
        """Add a message to the session history."""
        message = ChatMessage(role=role, content=content, coordinates=coordinates)
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
        return message
    
    def get_history_for_agent(self) -> list[dict]:
        """Get message history in format suitable for the agent."""
        return [
            {"role": msg.role, "content": msg.content}
            for msg in self.messages
        ]
    
    def to_dict(self) -> dict:
        """Convert session to dictionary for API responses."""
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "message_count": len(self.messages),
            "context": self.context
        }


class SessionManager:
    """
    Manages multiple chat sessions in memory.
    For a hackathon, in-memory storage is sufficient.
    For production, this would integrate with Supabase or another database.
    """
    
    def __init__(self):
        self._sessions: dict[str, ChatSession] = {}
    
    def create_session(self, name: Optional[str] = None) -> ChatSession:
        """Create a new chat session."""
        session_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        if name is None:
            name = f"Chat {len(self._sessions) + 1}"
        
        session = ChatSession(
            id=session_id,
            name=name,
            created_at=now,
            updated_at=now
        )
        self._sessions[session_id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a session by ID."""
        return self._sessions.get(session_id)
    
    def get_or_create_session(self, session_id: Optional[str] = None) -> ChatSession:
        """Get existing session or create a new one."""
        if session_id and session_id in self._sessions:
            return self._sessions[session_id]
        return self.create_session()
    
    def list_sessions(self) -> list[dict]:
        """List all sessions with summary info."""
        return [
            session.to_dict()
            for session in sorted(
                self._sessions.values(),
                key=lambda s: s.updated_at,
                reverse=True
            )
        ]
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session by ID."""
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False
    
    def update_session_context(self, session_id: str, context_update: dict) -> bool:
        """Update the context for a session (e.g., selected area)."""
        session = self._sessions.get(session_id)
        if session:
            session.context.update(context_update)
            session.updated_at = datetime.utcnow()
            return True
        return False


# Global session manager instance
session_manager = SessionManager()

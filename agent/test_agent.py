#!/usr/bin/env python3
"""
Quick test script for the Dubai RTA City Planning Agent.
Run this to verify the agent is working correctly.
"""
import asyncio
import httpx
import time

BASE_URL = "http://localhost:8080"


async def test_health():
    """Test the health check endpoint."""
    print("🔍 Testing health check...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200


async def test_create_session():
    """Test creating a new session."""
    print("\n📝 Creating new session...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/sessions",
            json={"name": "Test Session"}
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Session ID: {data.get('id')}")
        return data.get("id")


async def test_chat(session_id: str):
    """Test sending a chat message."""
    print("\n💬 Testing chat...")
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/chat",
            json={
                "message": "What are the main metro lines in Dubai?",
                "session_id": session_id
            }
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response preview: {data.get('response', '')[:200]}...")
        else:
            print(f"   Error: {response.text}")
        return response.status_code == 200


async def test_chat_with_coordinates(session_id: str):
    """Test sending a chat with map coordinates."""
    print("\n🗺️  Testing chat with coordinates (Dubai Marina)...")
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/chat/coordinates",
            json={
                "message": "Analyze the public transport coverage in this area",
                "latitude": 25.0657,
                "longitude": 55.1389,
                "radius_km": 2.0,
                "session_id": session_id
            }
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response preview: {data.get('response', '')[:200]}...")
        else:
            print(f"   Error: {response.text}")
        return response.status_code == 200


async def test_list_sessions():
    """Test listing all sessions."""
    print("\n📋 Listing sessions...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/sessions")
        print(f"   Status: {response.status_code}")
        sessions = response.json()
        print(f"   Total sessions: {len(sessions)}")
        return response.status_code == 200


async def main():
    print("=" * 50)
    print("🏙️  Dubai RTA City Planning Agent - Test Suite")
    print("=" * 50)
    
    try:
        # Health check
        if not await test_health():
            print("\n❌ Health check failed. Is the server running?")
            print("   Start with: python -m uvicorn agent.api_server:app --port 8080")
            return
        
        # Create session
        session_id = await test_create_session()
        if not session_id:
            print("\n❌ Failed to create session")
            return
        
        print("⏳ Waiting 2s for rate limit...")
        time.sleep(2)
        
        # Test chat
        await test_chat(session_id)
        print("⏳ Waiting 10s for rate limit...")
        time.sleep(10)
        
        # Test chat with coordinates
        await test_chat_with_coordinates(session_id)
        
        # List sessions
        await test_list_sessions()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("=" * 50)
        
    except httpx.ConnectError:
        print("\n❌ Could not connect to server at localhost:8080")
        print("   Make sure to start the server first:")
        print("   python -m uvicorn agent.api_server:app --port 8080")
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())

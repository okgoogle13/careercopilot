#!/usr/bin/env python3
"""
Quick smoke test for the Ghostwriter Agent.
Tests resume loading and cover letter generation with mock data.
"""
import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.agents.ghostwriter import GhostwriterAgent


async def test_ghostwriter():
    """Test the Ghostwriter agent with mock job data."""
    
    print("=" * 60)
    print("🧪 GHOSTWRITER AGENT SMOKE TEST")
    print("=" * 60)
    
    # Initialize agent
    print("\n[1/3] Initializing Ghostwriter Agent...")
    agent = GhostwriterAgent()
    print("✓ Agent initialized")
    
    # Test resume loading
    print("\n[2/3] Loading resume from user_profile/resume.md...")
    resume = await agent.load_resume()
    print(f"✓ Resume loaded: {len(resume)} characters")
    print(f"   Preview: {resume[:100]}...")
    
    # Test cover letter generation
    print("\n[3/3] Generating cover letter for mock job...")
    mock_job = {
        "title": "Senior Python Developer",
        "company": "Tech Innovations Pty Ltd",
        "description": """
        We are seeking an experienced Python developer to join our AI/ML team.
        
        Requirements:
        - 5+ years Python experience
        - FastAPI, Django, or Flask
        - Experience with LLMs and AI agents
        - Strong problem-solving skills
        - Excellent communication
        
        Responsibilities:
        - Build scalable backend services
        - Integrate AI/ML models into production
        - Collaborate with cross-functional teams
        - Mentor junior developers
        """,
        "salary": "$120,000 - $150,000 + Super",
        "deadline": "January 15, 2026",
        "url": "https://example.com/jobs/senior-python-dev"
    }
    
    cover_letter = await agent.generate_cover_letter(mock_job)
    
    print("\n" + "=" * 60)
    print("📝 GENERATED COVER LETTER:")
    print("=" * 60)
    print(cover_letter)
    print("=" * 60)
    
    # Statistics
    word_count = len(cover_letter.split())
    char_count = len(cover_letter)
    
    print(f"\n📊 Statistics:")
    print(f"   Words: {word_count}")
    print(f"   Characters: {char_count}")
    
    # Validation
    print(f"\n✅ Validation:")
    if word_count < 100:
        print("   ⚠️  WARNING: Cover letter seems too short (< 100 words)")
    elif word_count > 500:
        print("   ⚠️  WARNING: Cover letter is quite long (> 500 words)")
    else:
        print(f"   ✓ Length is appropriate ({word_count} words)")
    
    if "Error" in cover_letter or "failed" in cover_letter.lower():
        print("   ⚠️  WARNING: Cover letter contains error messages")
    else:
        print("   ✓ No obvious errors detected")
    
    # Check for job-specific content
    if mock_job['company'].lower() in cover_letter.lower():
        print(f"   ✓ Mentions company name: {mock_job['company']}")
    else:
        print(f"   ⚠️  WARNING: Doesn't mention company name")
    
    if mock_job['title'].lower() in cover_letter.lower():
        print(f"   ✓ Mentions job title: {mock_job['title']}")
    else:
        print(f"   ⚠️  WARNING: Doesn't mention job title")
    
    print("\n" + "=" * 60)
    print("✅ SMOKE TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_ghostwriter())

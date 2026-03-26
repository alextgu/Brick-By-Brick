from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from app.core.config import settings

router = APIRouter()

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

class StoryRequest(BaseModel):
    summary: str
    highlights: List[str]
    scenes: List[dict]
    context: str = ""

class StoryResponse(BaseModel):
    story: str
    objects: List[str]
    mood: str

@router.post("/story", response_model=StoryResponse)
async def build_story(req: StoryRequest):
    try:
        prompt = f"""
        You are helping turn a personal video memory into a Lego scene.
        
        Here is what the video analysis found:
        
        SUMMARY: {req.summary}
        
        HIGHLIGHTS: {', '.join(req.highlights)}
        
        SCENES DETECTED: {req.scenes}
        
        USER CONTEXT: {req.context if req.context else 'no context provided'}
        
        Your job has three parts:
        
        1. STORY: Write 2-3 warm sentences describing this memory as if 
        telling a friend. Focus on the feeling and setting, not just the objects.
        
        2. OBJECTS: Pick exactly 5 physical objects from this scene that would 
        best represent this memory as a Lego set. Choose objects with symbolic 
        weight — a globe means more than a generic chair. Think about what 
        objects would make someone instantly recognize this memory.
        
        3. MOOD: Describe the overall mood in 2-3 words (e.g. "warm and nostalgic", 
        "joyful and chaotic", "quiet and peaceful")
        
        Respond in this exact JSON format:
        {{
            "story": "...",
            "objects": ["object1", "object2", "object3", "object4", "object5"],
            "mood": "..."
        }}
        
        Only respond with the JSON, nothing else.
        """

        response = model.generate_content(prompt)
        
        # parse the JSON response
        import json
        cleaned = response.text.strip().replace("```json", "").replace("```", "")
        data = json.loads(cleaned)

        return StoryResponse(
            story=data["story"],
            objects=data["objects"],
            mood=data["mood"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
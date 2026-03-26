from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from twelvelabs import TwelveLabs
from app.core.config import settings

router = APIRouter()

client = TwelveLabs(api_key=settings.TWELVE_LABS_API_KEY)

class AnalyzeRequest(BaseModel):
    filename: str
    context: str = ""  # optional one-liner like "this is my childhood bedroom"

@router.post("/analyze")
async def analyze_video(req: AnalyzeRequest):
    try:
        # upload & index with both models
        task = client.task.create(
            index_id=settings.TWELVE_LABS_INDEX_ID,
            file=f"temp_videos/{req.filename}",
        )

        task.wait_for_done()

        if task.status != "ready":
            raise HTTPException(status_code=500, detail=f"Indexing failed: {task.status}")

        video_id = task.video_id

        # Pegasus — generate natural language summary + highlights
        summary = client.generate.summarize(
            video_id=video_id,
            type="summary"
        )

        highlights = client.generate.summarize(
            video_id=video_id,
            type="highlight"
        )

        # Marengo — search for key visual objects and scenes
        search_results = client.search.query(
            index_id=settings.TWELVE_LABS_INDEX_ID,
            query_text="objects furniture people food items in the scene",
            options=["visual"],
        )

        # pull out the top clips marengo found
        scenes = [
            {
                "start": clip.start,
                "end": clip.end,
                "score": clip.score,
            }
            for clip in search_results.data[:5]  # top 5 most relevant scenes
        ]

        return {
            "video_id": video_id,
            "summary": summary.summary,
            "highlights": [h.highlight for h in highlights.highlights],
            "scenes": scenes,
            "context": req.context
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
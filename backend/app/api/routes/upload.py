from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil, os

router = APIRouter()

TEMP_DIR = "temp_videos"

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # validate it's actually a video
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    os.makedirs(TEMP_DIR, exist_ok=True)
    save_path = f"{TEMP_DIR}/{file.filename}"
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "saved_to": save_path}
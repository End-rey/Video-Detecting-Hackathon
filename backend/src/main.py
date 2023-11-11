from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from video.router import router as video_router
from camera.router import router as camera_router
from train.router import router as train_router

app = FastAPI(
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    video_router,
    prefix="/api/video",
    tags=["Video"]
)

app.include_router(
    train_router,
    prefix="/api/train",
    tags=["Train"]
)

app.add_websocket_route("/api/camera", camera_router)

@app.get("/api/ping")
async def ping():
    return {"ping": "nice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")

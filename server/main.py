from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# สร้าง FastAPI instance
app = FastAPI()

# ตั้งค่า Origins ที่อนุญาต
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# เพิ่ม CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# สร้าง Pydantic Model สำหรับรับ JSON Body
class MsgRequest(BaseModel):
    username: str
    msg: str
    model: str


# Health Check Endpoint
@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok", "code": 200}


# Message Query Endpoint (ใช้ JSON Body)
@app.post("/msgquery")
async def msgquery(request: MsgRequest):
    truncated_msg = request.msg[:10]  # ตัดข้อความให้เหลือ 10 ตัวอักษรแรก
    return {
        "username": request.username,
        "message": truncated_msg,
        "model": request.model,
        "response": f"สวัสดี {request.username}, ข้อความของคุณ (ตัดเหลือ 10 ตัวอักษร): '{truncated_msg}'"
    }

# รันเซิร์ฟเวอร์ FastAPI เมื่อสคริปต์ถูกรันโดยตรง
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

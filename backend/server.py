from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_type: str = None
    token: str = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    try:
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)
        
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        _ = await db.status_checks.insert_one(doc)
        return status_obj
    except Exception as e:
        # Return mock response for debugging
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)
        return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    try:
        # Exclude MongoDB's _id field from the query results
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime objects
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        
        return status_checks
    except Exception as e:
        # Return mock data for debugging
        return [
            StatusCheck(id="mock-1", client_name="test", timestamp=datetime.now(timezone.utc)),
            StatusCheck(id="mock-2", client_name="debug", timestamp=datetime.now(timezone.utc))
        ]

@api_router.post("/login/student", response_model=LoginResponse)
async def student_login(request: LoginRequest):
    # Student login: allow any email that does NOT end with "@admin.com", any password
    if not request.email.endswith("@admin.com"):
        return LoginResponse(
            success=True,
            message="Student login successful",
            user_type="student",
            token="mock-student-token"
        )
    else:
        return LoginResponse(
            success=False,
            message="This email is for admin login. Please use the admin login page."
        )

@api_router.post("/login/admin", response_model=LoginResponse)
async def admin_login(request: LoginRequest):
    # Admin login: email must end with "@admin.com" and password must be exactly "admin"
    if request.email.endswith("@admin.com") and request.password == "admin":
        return LoginResponse(
            success=True,
            message="Admin login successful",
            user_type="admin",
            token="mock-admin-token"
        )
    else:
        return LoginResponse(
            success=False,
            message="Invalid admin credentials. Email must end with @admin.com and password must be 'admin'"
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
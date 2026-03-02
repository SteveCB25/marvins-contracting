from fastapi import FastAPI, APIRouter, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

# Import routes
from routes import contact, gallery, admin


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Marvin's Contracting API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Database dependency
async def get_database() -> AsyncIOMotorDatabase:
    return db


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Include contact routes
@api_router.post("/contact", status_code=201)
async def create_contact(inquiry_input: contact.ContactInquiryCreate, database: AsyncIOMotorDatabase = Depends(get_database)):
    return await contact.create_contact_inquiry(inquiry_input, database)

@api_router.get("/contact")
async def get_contacts(database: AsyncIOMotorDatabase = Depends(get_database), limit: int = 100):
    return await contact.get_contact_inquiries(database, limit)


# Include gallery routes
@api_router.get("/gallery")
async def get_gallery(database: AsyncIOMotorDatabase = Depends(get_database), category: str = None):
    return await gallery.get_gallery_images(database, category)

@api_router.get("/gallery/{category}")
async def get_gallery_cat(category: str, database: AsyncIOMotorDatabase = Depends(get_database)):
    return await gallery.get_gallery_by_category(category, database)

@api_router.post("/gallery", status_code=201)
async def create_gallery(image_input: gallery.GalleryImageCreate, database: AsyncIOMotorDatabase = Depends(get_database)):
    return await gallery.create_gallery_image(image_input, database)


# Include admin routes
@api_router.post("/admin/populate-gallery")
async def populate_gallery_route(database: AsyncIOMotorDatabase = Depends(get_database)):
    return await admin.populate_gallery_endpoint(database)


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
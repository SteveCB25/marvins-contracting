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


# Simple inline admin endpoint for populating gallery
@api_router.get("/admin/populate")
async def populate_inline(database: AsyncIOMotorDatabase = Depends(get_database)):
    """Populate gallery with inline data"""
    try:
        # Clear existing
        await database.gallery_images.delete_many({})
        
        # Insert data
        import uuid
        from datetime import datetime
        
        categories = {
            'kitchen': ['FB_IMG_1704681945343.JPG', 'FB_IMG_1772312454150.JPG', 'FB_IMG_1772312664284.JPG', 'FB_IMG_1772312803305.JPG', 'FB_IMG_1772312809422.JPG', 'FB_IMG_1772312890792.JPG', 'FB_IMG_1772312900616.JPG', 'FB_IMG_1772312921552.JPG', 'FB_IMG_1772313015765.JPG', 'Resized_20241121_174316.JPEG', 'Resized_20250718_091900.JPEG', 'Resized_20260227_163630.JPEG'],
            'bathroom': ['FB_IMG_1772312397483.JPG', 'FB_IMG_1772312404253.JPG', 'FB_IMG_1772312424140.JPG', 'FB_IMG_1772312429877.JPG', 'FB_IMG_1772312544046.JPG', 'FB_IMG_1772312557480.JPG', 'FB_IMG_1772312566473.JPG', 'FB_IMG_1772312591731.JPG', 'FB_IMG_1772312638258.JPG', 'FB_IMG_1772312731235.JPG', 'FB_IMG_1772312759311.JPG', 'FB_IMG_1772312770743.JPG', 'FB_IMG_1772312849677.JPG', 'FB_IMG_1772312853264.JPG', 'FB_IMG_1772312859989.JPG', 'FB_IMG_1772312864303.JPG', 'FB_IMG_1772312870222.JPG', 'FB_IMG_1772312883598.JPG', 'FB_IMG_1772312887790.JPG', 'FB_IMG_1772312897981.JPG', 'FB_IMG_1772312934586.JPG', 'FB_IMG_1772312941558.JPG', 'FB_IMG_1772312955937.JPG', 'FB_IMG_1772313045982.JPG', 'Resized_20231103_160554.JPEG', 'Resized_20241112_191053.JPEG', 'Resized_20241121_174319.JPEG', 'Resized_20241121_174319 2.JPEG', 'Resized_20241121_174322.JPEG', 'Resized_20250312_132015.JPEG', 'Resized_20251119_170928.JPEG', 'Resized_FB_IMG_1772312788195.JPEG'],
            'flooring': ['FB_IMG_1772312500865.JPG', 'FB_IMG_1772312600221.JPG', 'FB_IMG_1772312618114.JPG', 'FB_IMG_1772312627998.JPG', 'FB_IMG_1772312657762.JPG', 'FB_IMG_1772312749659.JPG', 'FB_IMG_1772312952304.JPG', 'FB_IMG_1772312966722.JPG', 'Resized_20231112_131423.JPEG', 'Resized_20241112_190908.JPEG', 'Resized_20241121_173258.JPEG', 'Resized_20241125_172118.JPEG', 'Resized_20241125_172134.JPEG', 'Resized_20250312_131534.JPEG', 'Resized_20250430_134100.JPEG', 'Resized_20250718_091121.JPEG', 'Resized_20251119_160958.JPEG', 'Resized_20251221_151247.JPEG', 'Resized_20251221_151252.JPEG', 'Resized_20260115_142231.JPEG', 'Resized_20260115_142256.JPEG'],
            'painting': ['FB_IMG_1704681957047.JPG', 'FB_IMG_1772312677184 2.JPG', 'FB_IMG_1772312693586.JPG', 'FB_IMG_1772312710250.JPG', 'FB_IMG_1772312949226.JPG', 'Resized_20240919_151128.JPEG', 'Resized_20250718_091853.JPEG', 'Resized_20250827_150451.JPEG', 'Resized_20260227_163616.JPEG', 'Resized_20260227_163638.JPEG', 'Resized_FB_IMG_1772312791238.JPEG']
        }
        
        total = 0
        for cat, files in categories.items():
            for idx, filename in enumerate(files, 1):
                doc = {
                    'id': str(uuid.uuid4()),
                    'filename': filename,
                    'url': f'/portfolio/{filename}',
                    'category': cat,
                    'alt_text': f'{cat.title()} by Marvins Contracting',
                    'order': idx,
                    'is_active': True,
                    'created_at': datetime.utcnow().isoformat()
                }
                await database.gallery_images.insert_one(doc)
                total += 1
        
        return {"success": True, "inserted": total}
    except Exception as e:
        return {"success": False, "error": str(e)}


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
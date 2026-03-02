#!/usr/bin/env python3
"""
One-time script to populate MongoDB Atlas with gallery images
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# Your MongoDB connection string
MONGO_URL = "mongodb+srv://stephenbtlr_db_user:fjHyjr5h4TPFTigU@marvins-cluster.l6njxup.mongodb.net/?appName=marvins-cluster"
DB_NAME = "marvins_contracting"

# Image categorization
IMAGE_CATEGORIES = {
    "kitchen": [
        "FB_IMG_1704681945343.JPG", "FB_IMG_1772312454150.JPG", "FB_IMG_1772312664284.JPG",
        "FB_IMG_1772312803305.JPG", "FB_IMG_1772312809422.JPG", "FB_IMG_1772312890792.JPG",
        "FB_IMG_1772312900616.JPG", "FB_IMG_1772312921552.JPG", "FB_IMG_1772313015765.JPG",
        "Resized_20241121_174316.JPEG", "Resized_20250718_091900.JPEG", "Resized_20260227_163630.JPEG"
    ],
    "bathroom": [
        "FB_IMG_1772312397483.JPG", "FB_IMG_1772312404253.JPG", "FB_IMG_1772312424140.JPG",
        "FB_IMG_1772312429877.JPG", "FB_IMG_1772312544046.JPG", "FB_IMG_1772312557480.JPG",
        "FB_IMG_1772312566473.JPG", "FB_IMG_1772312591731.JPG", "FB_IMG_1772312638258.JPG",
        "FB_IMG_1772312731235.JPG", "FB_IMG_1772312759311.JPG", "FB_IMG_1772312770743.JPG",
        "FB_IMG_1772312849677.JPG", "FB_IMG_1772312853264.JPG", "FB_IMG_1772312859989.JPG",
        "FB_IMG_1772312864303.JPG", "FB_IMG_1772312870222.JPG", "FB_IMG_1772312883598.JPG",
        "FB_IMG_1772312887790.JPG", "FB_IMG_1772312897981.JPG", "FB_IMG_1772312934586.JPG",
        "FB_IMG_1772312941558.JPG", "FB_IMG_1772312955937.JPG", "FB_IMG_1772313045982.JPG",
        "Resized_20231103_160554.JPEG", "Resized_20241112_191053.JPEG", "Resized_20241121_174319.JPEG",
        "Resized_20241121_174319 2.JPEG", "Resized_20241121_174322.JPEG", "Resized_20250312_132015.JPEG",
        "Resized_20251119_170928.JPEG", "Resized_FB_IMG_1772312788195.JPEG"
    ],
    "flooring": [
        "FB_IMG_1772312500865.JPG", "FB_IMG_1772312600221.JPG", "FB_IMG_1772312618114.JPG",
        "FB_IMG_1772312627998.JPG", "FB_IMG_1772312657762.JPG", "FB_IMG_1772312749659.JPG",
        "FB_IMG_1772312952304.JPG", "FB_IMG_1772312966722.JPG", "Resized_20231112_131423.JPEG",
        "Resized_20241112_190908.JPEG", "Resized_20241121_173258.JPEG", "Resized_20241125_172118.JPEG",
        "Resized_20241125_172134.JPEG", "Resized_20250312_131534.JPEG", "Resized_20250430_134100.JPEG",
        "Resized_20250718_091121.JPEG", "Resized_20251119_160958.JPEG", "Resized_20251221_151247.JPEG",
        "Resized_20251221_151252.JPEG", "Resized_20260115_142231.JPEG", "Resized_20260115_142256.JPEG"
    ],
    "painting": [
        "FB_IMG_1704681957047.JPG", "FB_IMG_1772312677184 2.JPG", "FB_IMG_1772312693586.JPG",
        "FB_IMG_1772312710250.JPG", "FB_IMG_1772312949226.JPG", "Resized_20240919_151128.JPEG",
        "Resized_20250718_091853.JPEG", "Resized_20250827_150451.JPEG", "Resized_20260227_163616.JPEG",
        "Resized_20260227_163638.JPEG", "Resized_FB_IMG_1772312791238.JPEG"
    ]
}

async def populate_gallery():
    """Populate MongoDB with gallery images"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🔗 Connected to MongoDB Atlas")
    print(f"📦 Database: {DB_NAME}")
    
    try:
        # Clear existing gallery images
        deleted = await db.gallery_images.delete_many({})
        print(f"🗑️  Cleared {deleted.deleted_count} existing images")
        
        total_inserted = 0
        
        # Insert images by category
        for category, images in IMAGE_CATEGORIES.items():
            print(f"\n📸 Processing {category}...")
            
            for index, filename in enumerate(images, start=1):
                image_doc = {
                    "id": str(uuid.uuid4()),
                    "filename": filename,
                    "url": f"/portfolio/{filename}",
                    "category": category,
                    "alt_text": f"{category.title()} by Marvin's Contracting",
                    "order": index,
                    "is_active": True,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                await db.gallery_images.insert_one(image_doc)
                total_inserted += 1
            
            print(f"   ✅ Added {len(images)} {category} images")
        
        print(f"\n🎉 SUCCESS! Populated gallery with {total_inserted} images")
        print(f"   - Kitchen: {len(IMAGE_CATEGORIES['kitchen'])} images")
        print(f"   - Bathroom: {len(IMAGE_CATEGORIES['bathroom'])} images")
        print(f"   - Flooring: {len(IMAGE_CATEGORIES['flooring'])} images")
        print(f"   - Painting: {len(IMAGE_CATEGORIES['painting'])} images")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        raise
    finally:
        client.close()
        print("\n✅ Database connection closed")

if __name__ == "__main__":
    print("=" * 60)
    print("  MARVIN'S CONTRACTING - DATABASE POPULATION")
    print("=" * 60)
    asyncio.run(populate_gallery())
